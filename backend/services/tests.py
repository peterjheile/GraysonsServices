import shutil
import tempfile
from io import BytesIO
from pathlib import Path
from unittest.mock import MagicMock, patch

from PIL import Image

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import DatabaseError
from django.test import TestCase, override_settings
from rest_framework.test import APIRequestFactory

from .models import Service, ServiceCategory, ServiceIncludedItem
from .serializers import ServiceSerializer
from .utils.image_processing import optimize_service_image
from .views import ServiceListView, ServiceNameListView


def image_upload(
    name="service.png",
    *,
    size=(80, 60),
    color="#6a7c52",
    image_format="PNG",
):
    output = BytesIO()
    Image.new("RGB", size, color).save(output, format=image_format)
    return SimpleUploadedFile(
        name,
        output.getvalue(),
        content_type=f"image/{image_format.lower()}",
    )


def animated_upload():
    output = BytesIO()
    frames = [
        Image.new("RGB", (16, 16), "red"),
        Image.new("RGB", (16, 16), "blue"),
    ]
    frames[0].save(
        output,
        format="GIF",
        save_all=True,
        append_images=frames[1:],
        duration=100,
        loop=0,
    )
    return SimpleUploadedFile(
        "animated.gif",
        output.getvalue(),
        content_type="image/gif",
    )


class ServiceTestMixin:
    def setUp(self):
        super().setUp()
        self.media_root = tempfile.mkdtemp()
        self.settings_override = override_settings(MEDIA_ROOT=self.media_root)
        self.settings_override.enable()
        self.category = ServiceCategory.objects.create(
            name="Decks & Porches",
        )

    def tearDown(self):
        self.settings_override.disable()
        shutil.rmtree(self.media_root, ignore_errors=True)
        super().tearDown()

    def create_service(self, **overrides):
        values = {
            "category": self.category,
            "name": "Deck Building",
            "subtitle": "Outdoor spaces built to last.",
            "overview": "Custom deck construction and restoration.",
            "process_description": "Plan, prepare, build, and inspect.",
            "primary_image": image_upload("primary.png"),
            "primary_image_alt": "Completed backyard deck",
            "supporting_image_one": image_upload("support-one.png"),
            "supporting_image_one_alt": "Deck framing in progress",
            "supporting_image_two": image_upload("support-two.png"),
            "supporting_image_two_alt": "Finished deck stairs",
        }
        values.update(overrides)
        return Service.objects.create(**values)


class ServiceSlugTests(ServiceTestMixin, TestCase):
    def test_category_slugs_are_nonempty_unique_and_stable(self):
        first = ServiceCategory.objects.create(name="Land & Lot")
        second = ServiceCategory.objects.create(name="Land Lot")
        punctuation = ServiceCategory.objects.create(name="!!!")

        self.assertEqual(first.slug, "land-lot")
        self.assertEqual(second.slug, "land-lot-2")
        self.assertEqual(punctuation.slug, "service-category")

        first.name = "Renamed Category"
        first.save()
        self.assertEqual(first.slug, "land-lot")

    def test_service_slugs_are_nonempty_unique_and_stable(self):
        first = self.create_service(name="Pressure Wash & Seal")
        second = self.create_service(name="Pressure Wash Seal")
        punctuation = self.create_service(name="!!!")

        self.assertEqual(first.slug, "pressure-wash-seal")
        self.assertEqual(second.slug, "pressure-wash-seal-2")
        self.assertEqual(punctuation.slug, "service")

        first.name = "Renamed Service"
        first.save(update_fields={"name"})
        self.assertEqual(first.slug, "pressure-wash-seal")


class ServiceApiTests(ServiceTestMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.factory = APIRequestFactory()

    def test_full_list_is_active_ordered_and_frontend_compatible(self):
        second = self.create_service(
            name="Second Service",
            display_order=2,
        )
        first = self.create_service(
            name="First Service",
            display_order=1,
        )
        self.create_service(
            name="Hidden Service",
            display_order=0,
            is_active=False,
        )
        ServiceIncludedItem.objects.create(
            service=first,
            text="Second included item",
            display_order=2,
        )
        ServiceIncludedItem.objects.create(
            service=first,
            text="First included item",
            display_order=1,
        )

        response = ServiceListView.as_view()(
            self.factory.get("/api/services/")
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [item["slug"] for item in response.data],
            [first.slug, second.slug],
        )
        self.assertEqual(
            set(response.data[0]),
            set(ServiceSerializer.Meta.fields),
        )
        self.assertEqual(
            [item["text"] for item in response.data[0]["included_items"]],
            ["First included item", "Second included item"],
        )
        self.assertTrue(
            response.data[0]["primary_image"].startswith(
                "http://testserver/"
            )
        )

    def test_names_list_is_active_lightweight_and_ordered(self):
        second = self.create_service(
            name="Second Service",
            display_order=2,
        )
        first = self.create_service(
            name="First Service",
            display_order=1,
        )
        self.create_service(name="Hidden Service", is_active=False)

        response = ServiceNameListView.as_view()(
            self.factory.get("/api/services/names/")
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            list(response.data),
            [
                {"name": first.name, "slug": first.slug},
                {"name": second.name, "slug": second.slug},
            ],
        )

    def test_full_list_query_count_stays_constant(self):
        for index in range(3):
            service = self.create_service(
                name=f"Service {index}",
                display_order=index,
            )
            ServiceIncludedItem.objects.create(
                service=service,
                text=f"Included item {index}",
            )

        request = self.factory.get("/api/services/")
        with self.assertNumQueries(2):
            response = ServiceListView.as_view()(request)
            list(response.data)


class ServiceImageLifecycleTests(ServiceTestMixin, TestCase):
    def test_replacing_image_deletes_old_file_after_commit(self):
        service = self.create_service()
        old_path = Path(service.primary_image.path)

        service.primary_image = image_upload(
            "replacement.png",
            color="blue",
        )
        with self.captureOnCommitCallbacks(execute=True):
            service.save(update_fields={"primary_image"})

        self.assertFalse(old_path.exists())
        self.assertTrue(Path(service.primary_image.path).exists())

    def test_queryset_delete_removes_all_service_images(self):
        service = self.create_service()
        image_paths = [
            Path(service.primary_image.path),
            Path(service.supporting_image_one.path),
            Path(service.supporting_image_two.path),
        ]

        with self.captureOnCommitCallbacks(execute=True):
            Service.objects.filter(pk=service.pk).delete()

        self.assertTrue(all(not path.exists() for path in image_paths))

    def test_update_fields_does_not_process_unrelated_new_image(self):
        service = self.create_service()
        original_name = service.primary_image.name
        service.primary_image = image_upload("ignored.png")
        service.subtitle = "Updated subtitle"

        service.save(update_fields={"subtitle"})
        service.refresh_from_db()

        self.assertEqual(service.primary_image.name, original_name)
        self.assertEqual(service.subtitle, "Updated subtitle")

    def test_failed_save_removes_all_newly_optimized_files(self):
        service = Service(
            category=self.category,
            name="Failed Service",
            subtitle="Failure",
            overview="Failure",
            process_description="Failure",
            primary_image=image_upload("failed-primary.png"),
            primary_image_alt="Primary",
            supporting_image_one=image_upload("failed-one.png"),
            supporting_image_one_alt="One",
            supporting_image_two=image_upload("failed-two.png"),
            supporting_image_two_alt="Two",
        )

        with patch(
            "django.db.models.Model.save",
            side_effect=DatabaseError("forced failure"),
        ):
            with self.assertRaises(DatabaseError):
                service.save()

        files = [
            path
            for path in Path(self.media_root).rglob("*")
            if path.is_file()
        ]
        self.assertEqual(files, [])


class ServiceImageProcessingTests(TestCase):
    def test_animated_image_is_rejected(self):
        with self.assertRaisesMessage(
            ValidationError,
            "Animated images are not supported",
        ):
            optimize_service_image(
                animated_upload(),
                max_dimension=1600,
            )

    def test_malformed_image_is_rejected_cleanly(self):
        upload = SimpleUploadedFile(
            "broken.jpg",
            b"not an image",
            content_type="image/jpeg",
        )
        with self.assertRaisesMessage(
            ValidationError,
            "not a valid supported image",
        ):
            optimize_service_image(upload, max_dimension=1600)

    def test_oversized_pixel_count_is_rejected_before_decode(self):
        fake_image = MagicMock()
        fake_image.__enter__.return_value = fake_image
        fake_image.__exit__.return_value = False
        fake_image.size = (10_000, 5_000)
        fake_image.n_frames = 1

        with patch(
            "services.utils.image_processing.Image.open",
            return_value=fake_image,
        ):
            with self.assertRaisesMessage(
                ValidationError,
                "too large to process safely",
            ):
                optimize_service_image(
                    image_upload(),
                    max_dimension=1600,
                )

    def test_invalid_max_dimension_is_rejected(self):
        with self.assertRaisesMessage(
            ValueError,
            "max_dimension must be greater than zero",
        ):
            optimize_service_image(image_upload(), max_dimension=0)

    def test_output_is_bounded_unique_webp(self):
        first_name, first = optimize_service_image(
            image_upload("My Service.JPG", size=(2500, 1000)),
            max_dimension=1920,
        )
        second_name, _second = optimize_service_image(
            image_upload("My Service.JPG", size=(2500, 1000)),
            max_dimension=1920,
        )

        self.assertNotEqual(first_name, second_name)
        self.assertTrue(first_name.endswith(".webp"))
        with Image.open(first) as image:
            self.assertLessEqual(max(image.size), 1920)
            self.assertEqual(image.format, "WEBP")