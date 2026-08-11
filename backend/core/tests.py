import shutil
import tempfile
from datetime import time
from io import BytesIO
from pathlib import Path
from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import IntegrityError, transaction
from django.test import TestCase, override_settings
from PIL import Image
from rest_framework.test import APIRequestFactory

from .models import BusinessHours, CompanyStats, SiteSettings
from .serializers import CompanyStatsSerializer, SiteSettingsSerializer
from .utils.image_processing import (
    create_optimized_favicon,
    create_optimized_logo,
    create_optimized_social_image,
)
from .validators import (
    validate_favicon,
    validate_logo,
    validate_social_image,
)
from .views import CompanyStatsView, SiteSettingsView


def image_upload(
    name="image.png",
    size=(1200, 630),
    image_format="PNG",
    *,
    exif=None,
):
    output = BytesIO()
    Image.new("RGB", size, "#243127").save(
        output,
        format=image_format,
        exif=exif,
    )
    return SimpleUploadedFile(
        name,
        output.getvalue(),
        content_type=f"image/{image_format.lower()}",
    )


class SingletonAndValidationTests(TestCase):
    def test_site_settings_is_database_backed_singleton(self):
        settings = SiteSettings.objects.create()
        with self.assertRaises(ValidationError):
            SiteSettings.objects.create(business_name="Second")
        with self.assertRaises(ValidationError):
            settings.delete()
        with self.assertRaises(ValidationError):
            SiteSettings.objects.all().delete()

    def test_company_stats_is_database_backed_singleton(self):
        stats = CompanyStats.objects.create()
        with self.assertRaises(ValidationError):
            CompanyStats.objects.create(client_satisfaction=90)
        with self.assertRaises(ValidationError):
            stats.delete()
        with self.assertRaises(ValidationError):
            CompanyStats.objects.all().delete()

    def test_singleton_key_database_constraint_cannot_be_bypassed(self):
        settings = SiteSettings.objects.create()
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                SiteSettings.objects.filter(pk=settings.pk).update(
                    singleton_key=2
                )

    def test_client_satisfaction_is_limited_to_zero_through_100(self):
        stats = CompanyStats.objects.create(client_satisfaction=100)
        for invalid_value in (101, 500):
            stats.client_satisfaction = invalid_value
            with self.subTest(invalid_value=invalid_value):
                with self.assertRaises(ValidationError):
                    stats.save()

    def test_database_rejects_invalid_satisfaction_when_save_is_bypassed(self):
        stats = CompanyStats.objects.create(client_satisfaction=90)
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                CompanyStats.objects.filter(pk=stats.pk).update(
                    client_satisfaction=101
                )

    def test_open_hours_require_complete_ordered_times(self):
        settings = SiteSettings.objects.create()
        invalid_rows = (
            {"opening_time": None, "closing_time": None},
            {"opening_time": time(8), "closing_time": None},
            {"opening_time": time(17), "closing_time": time(8)},
        )
        for index, values in enumerate(invalid_rows, start=1):
            with self.subTest(values=values):
                with self.assertRaises(ValidationError):
                    BusinessHours.objects.create(
                        site_settings=settings,
                        day=index,
                        is_closed=False,
                        **values,
                    )

    def test_closed_hours_require_empty_times(self):
        settings = SiteSettings.objects.create()
        with self.assertRaises(ValidationError):
            BusinessHours.objects.create(
                site_settings=settings,
                day=BusinessHours.DayOfWeek.MONDAY,
                opening_time=time(8),
                closing_time=time(17),
                is_closed=True,
            )

        closed = BusinessHours.objects.create(
            site_settings=settings,
            day=BusinessHours.DayOfWeek.SUNDAY,
            is_closed=True,
        )
        self.assertTrue(closed.is_closed)

    def test_business_hours_are_ordered_monday_through_sunday(self):
        settings = SiteSettings.objects.create()
        BusinessHours.objects.create(
            site_settings=settings,
            day=BusinessHours.DayOfWeek.FRIDAY,
            opening_time=time(8),
            closing_time=time(17),
        )
        BusinessHours.objects.create(
            site_settings=settings,
            day=BusinessHours.DayOfWeek.MONDAY,
            opening_time=time(8),
            closing_time=time(17),
        )
        self.assertEqual(
            list(settings.business_hours.values_list("day", flat=True)),
            [BusinessHours.DayOfWeek.MONDAY, BusinessHours.DayOfWeek.FRIDAY],
        )


class CoreAPITests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_missing_singletons_return_404_not_empty_objects(self):
        site_response = SiteSettingsView.as_view()(
            self.factory.get("/api/site-settings/")
        )
        stats_response = CompanyStatsView.as_view()(
            self.factory.get("/api/company-stats/")
        )
        self.assertEqual(site_response.status_code, 404)
        self.assertEqual(stats_response.status_code, 404)

    def test_site_settings_response_preserves_frontend_contract(self):
        settings = SiteSettings.objects.create(
            phone="812-555-0100",
            email="hello@example.com",
        )
        BusinessHours.objects.create(
            site_settings=settings,
            day=BusinessHours.DayOfWeek.MONDAY,
            opening_time=time(8),
            closing_time=time(17),
        )
        response = SiteSettingsView.as_view()(
            self.factory.get("/api/site-settings/")
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            set(response.data),
            set(SiteSettingsSerializer.Meta.fields),
        )
        self.assertEqual(response.data["business_hours"][0]["day_name"], "Monday")

    def test_company_stats_response_preserves_frontend_contract(self):
        CompanyStats.objects.create(
            years_in_business=4,
            projects_completed=120,
            client_satisfaction=98,
        )
        response = CompanyStatsView.as_view()(
            self.factory.get("/api/company-stats/")
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            set(response.data),
            set(CompanyStatsSerializer.Meta.fields),
        )
        self.assertEqual(response.data["client_satisfaction"], 98)

    def test_site_settings_uses_two_queries_with_hours(self):
        settings = SiteSettings.objects.create()
        BusinessHours.objects.create(
            site_settings=settings,
            day=BusinessHours.DayOfWeek.SUNDAY,
            is_closed=True,
        )
        request = self.factory.get("/api/site-settings/")
        with self.assertNumQueries(2):
            response = SiteSettingsView.as_view()(request)
            dict(response.data)


class SiteSettingsImageLifecycleTests(TestCase):
    def setUp(self):
        self.media_root = tempfile.mkdtemp()
        self.override = override_settings(MEDIA_ROOT=self.media_root)
        self.override.enable()
        super().setUp()

    def tearDown(self):
        self.override.disable()
        shutil.rmtree(self.media_root, ignore_errors=True)
        super().tearDown()

    def test_all_three_originals_generate_optimized_files(self):
        settings = SiteSettings.objects.create(
            logo=image_upload("logo.png", size=(800, 200)),
            favicon=image_upload("favicon.png", size=(256, 256)),
            social_image=image_upload("social.png", size=(1200, 630)),
        )
        for field_name in (
            "logo",
            "optimized_logo",
            "favicon",
            "optimized_favicon",
            "social_image",
            "optimized_social_image",
        ):
            field = getattr(settings, field_name)
            self.assertTrue(field)
            self.assertTrue(Path(field.path).exists())

    def test_logo_replacement_cleans_original_and_optimized_old_files(self):
        settings = SiteSettings.objects.create(
            logo=image_upload("old-logo.png", size=(800, 200)),
        )
        old_original = Path(settings.logo.path)
        old_optimized = Path(settings.optimized_logo.path)
        settings.logo = image_upload("new-logo.png", size=(900, 300))
        with self.captureOnCommitCallbacks(execute=True):
            settings.save()

        self.assertFalse(old_original.exists())
        self.assertFalse(old_optimized.exists())
        self.assertTrue(Path(settings.logo.path).exists())
        self.assertTrue(Path(settings.optimized_logo.path).exists())

    def test_clearing_original_also_clears_optimized_file(self):
        settings = SiteSettings.objects.create(
            favicon=image_upload("favicon.png", size=(256, 256)),
        )
        old_original = Path(settings.favicon.path)
        old_optimized = Path(settings.optimized_favicon.path)
        settings.favicon = None
        with self.captureOnCommitCallbacks(execute=True):
            settings.save(update_fields={"favicon"})
        settings.refresh_from_db()
        self.assertFalse(settings.favicon)
        self.assertFalse(settings.optimized_favicon)
        self.assertFalse(old_original.exists())
        self.assertFalse(old_optimized.exists())

    def test_update_fields_ignores_unlisted_transient_image(self):
        settings = SiteSettings.objects.create(
            logo=image_upload("old-logo.png", size=(800, 200)),
            tagline="Old",
        )
        old_logo = settings.logo.name
        old_optimized = settings.optimized_logo.name
        settings.logo = image_upload("ignored.png", size=(900, 300))
        settings.tagline = "New"
        settings.save(update_fields={"tagline"})
        settings.refresh_from_db()
        self.assertEqual(settings.logo.name, old_logo)
        self.assertEqual(settings.optimized_logo.name, old_optimized)
        self.assertEqual(settings.tagline, "New")

    def test_failed_second_database_save_cleans_every_new_file(self):
        from django.db.models import Model

        original_save = Model.save
        call_count = 0

        def fail_second_save(instance, *args, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count == 2:
                raise RuntimeError("simulated database failure")
            return original_save(instance, *args, **kwargs)

        settings = SiteSettings(
            logo=image_upload("failure.png", size=(800, 200)),
        )
        with patch("django.db.models.Model.save", new=fail_second_save):
            with self.assertRaises(RuntimeError):
                settings.save()

        self.assertFalse(SiteSettings.objects.exists())
        self.assertEqual(list(Path(self.media_root).rglob("*.*")), [])


class CoreImageValidationTests(TestCase):
    def test_malformed_images_are_rejected(self):
        invalid = SimpleUploadedFile("bad.png", b"not an image")
        for validator in (
            validate_logo,
            validate_favicon,
            validate_social_image,
        ):
            with self.subTest(validator=validator.__name__):
                invalid.seek(0)
                with self.assertRaises(ValidationError):
                    validator(invalid)

    def test_animated_images_are_rejected(self):
        output = BytesIO()
        frames = [
            Image.new("RGB", (1200, 630), "red"),
            Image.new("RGB", (1200, 630), "blue"),
        ]
        frames[0].save(
            output,
            format="WEBP",
            save_all=True,
            append_images=frames[1:],
        )
        animated = SimpleUploadedFile("animated.webp", output.getvalue())
        with self.assertRaises(ValidationError):
            validate_social_image(animated)

    def test_social_dimensions_use_exif_corrected_orientation(self):
        exif = Image.Exif()
        exif[274] = 6
        portrait = image_upload(
            "rotated.jpg",
            size=(630, 1200),
            image_format="JPEG",
            exif=exif,
        )
        validate_social_image(portrait)

    def test_processors_return_unique_correctly_sized_files(self):
        logo_one = create_optimized_logo(
            image_upload("brand.png", size=(1600, 400))
        )
        logo_two = create_optimized_logo(
            image_upload("brand.png", size=(1600, 400))
        )
        self.assertNotEqual(logo_one.name, logo_two.name)
        with Image.open(logo_one) as image:
            self.assertLessEqual(max(image.size), 1000)
            self.assertEqual(image.format, "WEBP")

        favicon = create_optimized_favicon(
            image_upload("icon.png", size=(256, 256))
        )
        with Image.open(favicon) as image:
            self.assertEqual(image.size, (192, 192))

        social = create_optimized_social_image(
            image_upload("share.png", size=(1500, 1000))
        )
        with Image.open(social) as image:
            self.assertEqual(image.size, (1200, 630))