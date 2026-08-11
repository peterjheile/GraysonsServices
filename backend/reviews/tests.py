import shutil
import tempfile
from datetime import date
from io import BytesIO
from pathlib import Path
from unittest.mock import patch

from PIL import Image

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import DatabaseError, IntegrityError, transaction
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient

from projects.models import Project
from services.models import ServiceCategory

from .models import Review
from .utils.image_processing import optimize_profile_image


def image_upload(name="profile.png", *, color="red"):
    output = BytesIO()
    Image.new("RGB", (32, 24), color).save(output, format="PNG")
    return SimpleUploadedFile(
        name,
        output.getvalue(),
        content_type="image/png",
    )


def animated_upload():
    output = BytesIO()
    frames = [
        Image.new("RGB", (8, 8), "red"),
        Image.new("RGB", (8, 8), "blue"),
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


class ReviewTestMixin:
    @classmethod
    def setUpTestData(cls):
        cls.category = ServiceCategory.objects.create(name="Decks & Porches")
        cls.other_category = ServiceCategory.objects.create(name="Landscaping")
        cls.project = Project.objects.create(
            title="Backyard Deck",
            category=cls.category,
        )

    def review_data(self, **overrides):
        today = date.today()
        data = {
            "reviewer_name": "Taylor Smith",
            "quote": "Excellent work from start to finish.",
            "review_month": today.month,
            "review_year": today.year,
        }
        data.update(overrides)
        return data


class ReviewModelTests(ReviewTestMixin, TestCase):
    def test_featured_review_requires_project(self):
        with self.assertRaises(ValidationError):
            Review.objects.create(
                **self.review_data(is_featured=True)
            )

    def test_project_category_is_authoritative_on_create(self):
        review = Review.objects.create(
            **self.review_data(
                project=self.project,
                category=self.other_category,
            )
        )
        self.assertEqual(review.category, self.category)

    def test_project_category_is_authoritative_after_project_change(self):
        review = Review.objects.create(
            **self.review_data(project=self.project)
        )
        self.project.category = self.other_category
        self.project.save()
        review.refresh_from_db()
        self.assertEqual(review.category, self.other_category)

    def test_future_month_in_current_year_is_rejected(self):
        today = date.today()
        if today.month == 12:
            self.skipTest("There is no later month in the current year.")

        with self.assertRaises(ValidationError):
            Review.objects.create(
                **self.review_data(review_month=today.month + 1)
            )

    def test_year_before_2015_is_protected_by_database_constraint(self):
        invalid_review = Review(
            **self.review_data(review_year=2014)
        )
        with self.assertRaises(IntegrityError), transaction.atomic():
            Review.objects.bulk_create([invalid_review])

    def test_rating_is_protected_by_database_constraint(self):
        invalid_review = Review(
            **self.review_data(rating=6)
        )
        with self.assertRaises(IntegrityError), transaction.atomic():
            Review.objects.bulk_create([invalid_review])

    def test_month_is_protected_by_database_constraint(self):
        invalid_review = Review(
            **self.review_data(review_month=13)
        )
        with self.assertRaises(IntegrityError), transaction.atomic():
            Review.objects.bulk_create([invalid_review])

    def test_featured_project_rule_is_protected_by_database_constraint(self):
        invalid_review = Review(
            **self.review_data(is_featured=True)
        )
        with self.assertRaises(IntegrityError), transaction.atomic():
            Review.objects.bulk_create([invalid_review])


class ReviewApiTests(ReviewTestMixin, TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_list_excludes_inactive_reviews_and_matches_contract(self):
        visible = Review.objects.create(
            **self.review_data(
                reviewer_name="Visible Reviewer",
                project=self.project,
                show_on_homepage=True,
            )
        )
        Review.objects.create(
            **self.review_data(
                reviewer_name="Hidden Reviewer",
                is_active=False,
            )
        )

        response = self.client.get(reverse("reviews:review-list"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], visible.id)
        self.assertEqual(response.data[0]["category"], self.category.name)
        self.assertEqual(response.data[0]["project"]["slug"], self.project.slug)
        self.assertIn("profile_image_url", response.data[0])
        self.assertIn("review_date_label", response.data[0])

    def test_category_and_source_filters_combine(self):
        matching = Review.objects.create(
            **self.review_data(
                reviewer_name="Matching Reviewer",
                project=self.project,
                source=Review.Source.GOOGLE,
            )
        )
        Review.objects.create(
            **self.review_data(
                reviewer_name="Different Source",
                project=self.project,
                source=Review.Source.FACEBOOK,
            )
        )

        response = self.client.get(
            reverse("reviews:review-list"),
            {"category": self.category.slug, "source": "google"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["id"] for item in response.data], [matching.id])

    def test_invalid_source_returns_400(self):
        response = self.client.get(
            reverse("reviews:review-list"),
            {"source": "unsupported"},
        )
        self.assertEqual(response.status_code, 400)

    def test_homepage_endpoint_only_returns_selected_active_reviews(self):
        second = Review.objects.create(
            **self.review_data(
                reviewer_name="Second Homepage Reviewer",
                show_on_homepage=True,
                homepage_order=2,
            )
        )
        first = Review.objects.create(
            **self.review_data(
                reviewer_name="First Homepage Reviewer",
                show_on_homepage=True,
                homepage_order=1,
            )
        )
        Review.objects.create(
            **self.review_data(reviewer_name="Not Selected")
        )

        response = self.client.get(reverse("reviews:homepage-review-list"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [item["id"] for item in response.data],
            [first.id, second.id],
        )


class ReviewImageLifecycleTests(ReviewTestMixin, TestCase):
    def setUp(self):
        self.media_root = tempfile.mkdtemp()
        self.override = override_settings(MEDIA_ROOT=self.media_root)
        self.override.enable()
        self.addCleanup(self.override.disable)
        self.addCleanup(shutil.rmtree, self.media_root, True)

    def test_replacing_profile_image_deletes_old_file_after_commit(self):
        review = Review.objects.create(
            **self.review_data(profile_image=image_upload())
        )
        old_path = Path(review.profile_image.path)
        self.assertTrue(old_path.exists())

        review.profile_image = image_upload("replacement.png", color="blue")
        with self.captureOnCommitCallbacks(execute=True):
            review.save(update_fields={"profile_image"})

        self.assertFalse(old_path.exists())
        self.assertTrue(Path(review.profile_image.path).exists())

    def test_queryset_delete_removes_profile_image_after_commit(self):
        review = Review.objects.create(
            **self.review_data(profile_image=image_upload())
        )
        image_path = Path(review.profile_image.path)

        with self.captureOnCommitCallbacks(execute=True):
            Review.objects.filter(pk=review.pk).delete()

        self.assertFalse(image_path.exists())

    def test_clearing_profile_image_deletes_old_file_after_commit(self):
        review = Review.objects.create(
            **self.review_data(profile_image=image_upload())
        )
        image_path = Path(review.profile_image.path)

        review.profile_image = None
        with self.captureOnCommitCallbacks(execute=True):
            review.save(update_fields={"profile_image"})

        self.assertFalse(image_path.exists())
        self.assertFalse(review.profile_image)

    def test_failed_save_removes_newly_written_optimized_file(self):
        review = Review(**self.review_data(profile_image=image_upload()))

        with patch(
            "django.db.models.Model.save",
            side_effect=DatabaseError("forced failure"),
        ):
            with self.assertRaises(DatabaseError):
                review.save()

        files = [path for path in Path(self.media_root).rglob("*") if path.is_file()]
        self.assertEqual(files, [])


class ProfileImageProcessingTests(TestCase):
    def test_animated_image_is_rejected(self):
        with self.assertRaisesMessage(
            ValidationError,
            "Animated images are not supported",
        ):
            optimize_profile_image(animated_upload())

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
            optimize_profile_image(upload)

    @patch("reviews.utils.image_processing.PROFILE_IMAGE_MAX_PIXELS", 100)
    def test_oversized_pixel_count_is_rejected(self):
        output = BytesIO()
        Image.new("RGB", (11, 10), "red").save(output, format="PNG")
        upload = SimpleUploadedFile("large.png", output.getvalue())

        with self.assertRaisesMessage(
            ValidationError,
            "too large to process safely",
        ):
            optimize_profile_image(upload)