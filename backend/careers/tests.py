from django.test import TestCase

# Create your tests here.
from datetime import date, timedelta
from decimal import Decimal
from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.db.models.deletion import ProtectedError
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from .models import (
    JobCategory,
    JobNiceToHave,
    JobPosting,
    JobRequirement,
    JobResponsibility,
)


class CareersFactoryMixin:
    def create_category(self, **overrides):
        values = {
            "name": "Field Operations",
            "display_order": 0,
            "is_active": True,
        }
        values.update(overrides)
        return JobCategory.objects.create(**values)

    def create_job(self, **overrides):
        category = overrides.pop("category", None)
        if category is None:
            category = getattr(self, "category", None)
        if category is None:
            category = self.create_category()

        values = {
            "category": category,
            "title": "Landscape Crew Member",
            "location": "Bloomington, IN",
            "seniority": JobPosting.Seniority.ENTRY,
            "employment_type": JobPosting.EmploymentType.FULL_TIME,
            "is_urgent": False,
            "posted_at": date(2026, 8, 10),
            "pay_min": Decimal("18.00"),
            "pay_max": Decimal("24.00"),
            "pay_unit": JobPosting.PayUnit.HOUR,
            "description": "Join our property-services field team.",
            "status": JobPosting.Status.OPEN,
            "display_order": 0,
        }
        values.update(overrides)
        return JobPosting.objects.create(**values)


class CareersSlugTests(CareersFactoryMixin, TestCase):
    def test_category_slugs_are_automatic_unique_nonempty_and_stable(self):
        first = self.create_category(name="Land & Lot")
        second = self.create_category(name="Land Lot")
        punctuation = self.create_category(name="***")
        punctuation_collision = self.create_category(name="###")

        self.assertEqual(first.slug, "land-lot")
        self.assertEqual(second.slug, "land-lot-2")
        self.assertEqual(punctuation.slug, "job-category")
        self.assertEqual(
            punctuation_collision.slug,
            "job-category-2",
        )

        first.name = "Renamed Category"
        first.save()
        first.refresh_from_db()
        self.assertEqual(first.slug, "land-lot")

    def test_job_slugs_are_unique_nonempty_length_safe_and_stable(self):
        self.category = self.create_category()
        first = self.create_job(title="Pressure Wash & Seal")
        second = self.create_job(title="Pressure Wash Seal")
        punctuation = self.create_job(title="!!!")

        self.assertEqual(first.slug, "pressure-wash-seal")
        self.assertEqual(second.slug, "pressure-wash-seal-2")
        self.assertEqual(punctuation.slug, "job")

        first.title = "Exterior Cleaning Technician"
        first.save()
        first.refresh_from_db()
        self.assertEqual(first.slug, "pressure-wash-seal")

        long_title = "A" * 150
        long_first = self.create_job(title=long_title)
        long_second = self.create_job(title=long_title)

        self.assertLessEqual(len(long_first.slug), 170)
        self.assertLessEqual(len(long_second.slug), 170)
        self.assertTrue(long_second.slug.endswith("-2"))

    def test_generated_slug_is_persisted_during_partial_save(self):
        self.category = self.create_category()
        job = self.create_job()

        job.slug = ""
        job.title = "Crew Leader"
        job.save(update_fields={"title"})
        job.refresh_from_db()

        self.assertEqual(job.title, "Crew Leader")
        self.assertEqual(job.slug, "crew-leader")

    def test_generated_slug_retries_if_candidate_is_claimed(self):
        self.category = self.create_category()
        self.create_job()

        with patch(
            "careers.models._build_unique_slug",
            side_effect=(
                "landscape-crew-member",
                "landscape-crew-member-2",
            ),
        ):
            second = self.create_job()

        self.assertEqual(second.slug, "landscape-crew-member-2")

    def test_programmatic_slug_must_match_model_length_and_format(self):
        self.category = self.create_category()

        with self.assertRaises(ValidationError):
            self.create_job(slug="a" * 171)

        with self.assertRaises(ValidationError):
            self.create_job(slug="not a valid slug")

    def test_database_constraints_reject_empty_slugs(self):
        category = self.create_category()
        self.category = category
        job = self.create_job()

        with self.assertRaises(IntegrityError), transaction.atomic():
            JobCategory.objects.filter(pk=category.pk).update(slug="")

        with self.assertRaises(IntegrityError), transaction.atomic():
            JobPosting.objects.filter(pk=job.pk).update(slug="")


class CareersValidationTests(CareersFactoryMixin, TestCase):
    def setUp(self):
        self.category = self.create_category()

    def test_direct_saves_require_complete_valid_pay_ranges(self):
        with self.assertRaises(ValidationError) as missing_end:
            self.create_job(pay_min=Decimal("18.00"), pay_max=None)

        self.assertIn("pay_max", missing_end.exception.message_dict)

        with self.assertRaises(ValidationError) as reversed_range:
            self.create_job(
                pay_min=Decimal("25.00"),
                pay_max=Decimal("20.00"),
            )

        self.assertIn("pay_max", reversed_range.exception.message_dict)

        with self.assertRaises(ValidationError):
            self.create_job(
                pay_min=Decimal("-1.00"),
                pay_max=Decimal("20.00"),
            )

    def test_direct_saves_validate_choices_and_required_fields(self):
        with self.assertRaises(ValidationError) as invalid_choice:
            self.create_job(employment_type="unsupported")

        self.assertIn(
            "employment_type",
            invalid_choice.exception.message_dict,
        )

        with self.assertRaises(ValidationError) as blank_description:
            self.create_job(description="")

        self.assertIn(
            "description",
            blank_description.exception.message_dict,
        )

    def test_database_constraint_rejects_invalid_pay_updates(self):
        job = self.create_job()

        with self.assertRaises(IntegrityError), transaction.atomic():
            JobPosting.objects.filter(pk=job.pk).update(pay_max=None)

        with self.assertRaises(IntegrityError), transaction.atomic():
            JobPosting.objects.filter(pk=job.pk).update(
                pay_min=Decimal("30.00"),
                pay_max=Decimal("20.00"),
            )


class CareersOrderingAndDeletionTests(CareersFactoryMixin, TestCase):
    def setUp(self):
        self.category = self.create_category()

    def test_posting_order_has_a_deterministic_primary_key_tiebreaker(self):
        first = self.create_job(title="Same Role")
        second = self.create_job(title="Same Role")

        jobs = list(JobPosting.objects.all())
        self.assertEqual(jobs, [first, second])

    def test_nested_items_use_display_order_then_primary_key(self):
        job = self.create_job()
        last = JobResponsibility.objects.create(
            job_posting=job,
            text="Last",
            display_order=2,
        )
        first = JobResponsibility.objects.create(
            job_posting=job,
            text="First",
            display_order=1,
        )
        second = JobResponsibility.objects.create(
            job_posting=job,
            text="Second",
            display_order=1,
        )

        self.assertEqual(
            list(job.responsibilities.all()),
            [first, second, last],
        )

    def test_category_deletion_is_protected(self):
        self.create_job()

        with self.assertRaises(ProtectedError):
            self.category.delete()

    def test_deleting_job_cascades_to_all_nested_items(self):
        job = self.create_job()
        JobResponsibility.objects.create(job_posting=job, text="One")
        JobRequirement.objects.create(job_posting=job, text="Two")
        JobNiceToHave.objects.create(job_posting=job, text="Three")

        job.delete()

        self.assertFalse(JobResponsibility.objects.exists())
        self.assertFalse(JobRequirement.objects.exists())
        self.assertFalse(JobNiceToHave.objects.exists())


class CareersApiTests(CareersFactoryMixin, TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = self.create_category()
        self.list_url = reverse("careers:job-posting-list")

    def detail_url(self, job):
        return reverse(
            "careers:job-posting-detail",
            kwargs={"slug": job.slug},
        )

    def test_list_exposes_only_open_jobs_in_active_categories(self):
        visible = self.create_job(title="Visible")
        self.create_job(title="Draft", status=JobPosting.Status.DRAFT)
        self.create_job(title="Closed", status=JobPosting.Status.CLOSED)
        inactive_category = self.create_category(
            name="Inactive",
            is_active=False,
        )
        self.create_job(title="Inactive Category", category=inactive_category)

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [item["slug"] for item in response.json()],
            [visible.slug],
        )

    def test_future_open_jobs_keep_current_publication_behavior(self):
        future = self.create_job(
            title="Future Dated",
            posted_at=timezone.localdate() + timedelta(days=30),
        )

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["slug"], future.slug)

    def test_detail_returns_404_for_every_nonpublic_job(self):
        draft = self.create_job(
            title="Draft",
            status=JobPosting.Status.DRAFT,
        )
        closed = self.create_job(
            title="Closed",
            status=JobPosting.Status.CLOSED,
        )
        inactive_category = self.create_category(
            name="Inactive",
            is_active=False,
        )
        inactive = self.create_job(
            title="Inactive Category",
            category=inactive_category,
        )

        for job in (draft, closed, inactive):
            with self.subTest(slug=job.slug):
                response = self.client.get(self.detail_url(job))
                self.assertEqual(response.status_code, 404)

    def test_api_shape_labels_dates_decimals_and_nested_ordering(self):
        job = self.create_job(
            seniority="",
            posted_at=date(2026, 8, 10),
            pay_min=Decimal("20.00"),
            pay_max=Decimal("25.50"),
            pay_unit=JobPosting.PayUnit.HOUR,
        )
        JobResponsibility.objects.create(
            job_posting=job,
            text="Later responsibility",
            display_order=2,
        )
        JobResponsibility.objects.create(
            job_posting=job,
            text="First responsibility",
            display_order=1,
        )
        JobRequirement.objects.create(
            job_posting=job,
            text="Valid driver's license",
        )
        JobNiceToHave.objects.create(
            job_posting=job,
            text="Landscaping experience",
        )

        response = self.client.get(self.detail_url(job))
        payload = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            set(payload),
            {
                "slug",
                "title",
                "location",
                "category",
                "seniority",
                "seniority_label",
                "employment_type",
                "employment_type_label",
                "is_urgent",
                "posted_at",
                "pay_min",
                "pay_max",
                "pay_unit",
                "pay_unit_label",
                "description",
                "responsibilities",
                "requirements",
                "nice_to_haves",
            },
        )
        self.assertEqual(
            payload["category"],
            {
                "name": self.category.name,
                "slug": self.category.slug,
            },
        )
        self.assertEqual(payload["seniority"], "")
        self.assertEqual(payload["seniority_label"], "")
        self.assertEqual(payload["employment_type_label"], "Full-Time")
        self.assertEqual(payload["posted_at"], "2026-08-10")
        self.assertEqual(payload["pay_min"], "20.00")
        self.assertEqual(payload["pay_max"], "25.50")
        self.assertEqual(payload["pay_unit_label"], "Per Hour")
        self.assertEqual(
            payload["responsibilities"],
            [
                {"text": "First responsibility"},
                {"text": "Later responsibility"},
            ],
        )
        self.assertEqual(
            payload["requirements"],
            [{"text": "Valid driver's license"}],
        )
        self.assertEqual(
            payload["nice_to_haves"],
            [{"text": "Landscaping experience"}],
        )

    def test_nullable_pay_values_are_serialized_as_null(self):
        job = self.create_job(pay_min=None, pay_max=None)

        response = self.client.get(self.detail_url(job))
        payload = response.json()

        self.assertIsNone(payload["pay_min"])
        self.assertIsNone(payload["pay_max"])

    def test_posting_order_is_stable_in_api(self):
        first = self.create_job(title="Same Role")
        second = self.create_job(title="Same Role")

        response = self.client.get(self.list_url)

        self.assertEqual(
            [item["slug"] for item in response.json()],
            [first.slug, second.slug],
        )

    def test_list_query_count_is_constant_at_four(self):
        for number in range(3):
            job = self.create_job(title=f"Role {number}")
            JobResponsibility.objects.create(
                job_posting=job,
                text=f"Responsibility {number}",
            )
            JobRequirement.objects.create(
                job_posting=job,
                text=f"Requirement {number}",
            )
            JobNiceToHave.objects.create(
                job_posting=job,
                text=f"Nice to have {number}",
            )

        with self.assertNumQueries(4):
            response = self.client.get(self.list_url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.json()), 3)

    @override_settings(
        REST_FRAMEWORK={
            "DEFAULT_PERMISSION_CLASSES": (
                "rest_framework.permissions.IsAuthenticated",
            ),
        }
    )
    def test_public_views_override_restrictive_global_permissions(self):
        self.create_job()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, 200)