import shutil
import tempfile
from datetime import date
from io import BytesIO
from pathlib import Path
from unittest import mock
from zipfile import ZIP_DEFLATED, ZipFile

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import IntegrityError, transaction
from django.db.models.deletion import ProtectedError
from django.test import TestCase, override_settings
from django.urls import resolve, reverse
from django.utils import timezone
from PIL import Image
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.test import APIClient, APIRequestFactory

from careers.models import JobCategory, JobPosting
from services.models import Service, ServiceCategory

from .models import (
    MAX_QUOTE_REQUEST_PHOTOS,
    ContactSubmission,
    JobApplication,
    QuoteRequest,
    QuoteRequestPhoto,
)
from .serializers import QuoteRequestSerializer
from .storage import private_media_storage
from .throttles import (
    ContactSubmissionBurstThrottle,
    JobApplicationBurstThrottle,
    QuoteRequestBurstThrottle,
)
from .validators import validate_quote_photo, validate_resume_contents
from .views import (
    ContactSubmissionCreateView,
    JobApplicationCreateView,
    QuoteRequestCreateView,
    _send_contact_emails,
)


def make_image(name="photo.png", *, image_format="PNG", size=(8, 8)):
    output = BytesIO()
    Image.new("RGB", size, color=(30, 120, 60)).save(
        output,
        format=image_format,
    )
    return SimpleUploadedFile(
        name,
        output.getvalue(),
        content_type="application/octet-stream",
    )


def make_resume(name="resume.pdf", content=b"%PDF-1.7\ncontact test"):
    return SimpleUploadedFile(
        name,
        content,
        content_type="application/octet-stream",
    )


def make_docx(name="resume.docx", *, bomb=False):
    output = BytesIO()

    with ZipFile(output, "w", compression=ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", "<Types />")
        archive.writestr(
            "word/document.xml",
            ("x" * 1_000_000) if bomb else "<document />",
        )

    return SimpleUploadedFile(
        name,
        output.getvalue(),
        content_type=(
            "application/vnd.openxmlformats-officedocument."
            "wordprocessingml.document"
        ),
    )


class PrivateStorageTestMixin:
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls._private_directory = tempfile.TemporaryDirectory()
        cls._old_storage_location = private_media_storage._location
        private_media_storage._location = Path(cls._private_directory.name)
        private_media_storage.__dict__.pop("base_location", None)
        private_media_storage.__dict__.pop("location", None)

    @classmethod
    def tearDownClass(cls):
        private_media_storage._location = cls._old_storage_location
        private_media_storage.__dict__.pop("base_location", None)
        private_media_storage.__dict__.pop("location", None)
        cls._private_directory.cleanup()
        super().tearDownClass()

    def setUp(self):
        super().setUp()
        storage_root = Path(private_media_storage.location)
        shutil.rmtree(storage_root, ignore_errors=True)
        storage_root.mkdir(parents=True, exist_ok=True)


class ContactFactoriesMixin:
    def create_job(self, **overrides):
        category = overrides.pop("category", None)

        if category is None:
            category = JobCategory.objects.create(
                name=f"Field Operations {JobCategory.objects.count()}",
            )

        values = {
            "category": category,
            "title": f"Crew Member {JobPosting.objects.count()}",
            "location": "Bloomington, IN",
            "seniority": JobPosting.Seniority.ENTRY,
            "employment_type": JobPosting.EmploymentType.FULL_TIME,
            "posted_at": date.today(),
            "pay_min": "18.00",
            "pay_max": "24.00",
            "pay_unit": JobPosting.PayUnit.HOUR,
            "description": "Help complete property improvement projects.",
            "status": JobPosting.Status.OPEN,
        }
        values.update(overrides)
        return JobPosting.objects.create(**values)

    def application_values(self, job_posting, **overrides):
        values = {
            "job_posting": job_posting,
            "first_name": "Alex",
            "last_name": "Applicant",
            "email": "alex@example.com",
            "phone": "812-555-0100",
            "city": "Bloomington",
            "years_experience": JobApplication.YearsOfExperience.ONE_TO_THREE,
            "availability": JobApplication.Availability.WITHIN_TWO_WEEKS,
            "pay_range_response": JobApplication.PayRangeResponse.ACCEPT,
            "motivation": "I enjoy careful outdoor work and helping customers.",
            "consent": True,
        }
        values.update(overrides)
        return values

    def quote_values(self, **overrides):
        values = {
            "first_name": "Quinn",
            "last_name": "Customer",
            "email": "quinn@example.com",
            "phone": "812-555-0110",
            "service_type": "not-sure",
            "project_size": QuoteRequest.ProjectSize.NOT_SURE,
            "budget": QuoteRequest.Budget.NOT_SURE,
            "consent": True,
        }
        values.update(overrides)
        return values


class EndpointContractTests(
    PrivateStorageTestMixin,
    ContactFactoriesMixin,
    TestCase,
):
    def setUp(self):
        super().setUp()
        cache.clear()
        self.client = APIClient()

    @mock.patch("contact.views._send_contact_emails")
    def test_contact_endpoint_and_response_contract(self, send_emails):
        payload = {
            "first_name": "Peter",
            "last_name": "Heile",
            "email": "peter@example.com",
            "phone": "",
            "subject": "S" * 200,
            "message": "Please contact me.",
        }

        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.post(
                "/api/contact/",
                payload,
                format="json",
            )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(set(response.data), {*payload, "created_at"})
        send_emails.assert_called_once()

    @mock.patch("contact.views._send_quote_request_emails")
    def test_quote_endpoint_and_response_contract(self, send_emails):
        payload = self.quote_values()

        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.post(
                "/api/quote-request/",
                payload,
                format="multipart",
            )

        self.assertEqual(response.status_code, 201)
        self.assertNotIn("photos", response.data)
        self.assertEqual(response.data["service_type"], "not-sure")
        send_emails.assert_called_once()

    @mock.patch("contact.views._send_job_application_emails")
    def test_application_endpoint_and_response_contract(self, send_emails):
        job = self.create_job()
        payload = self.application_values(job.slug)

        with self.captureOnCommitCallbacks(execute=True):
            response = self.client.post(
                "/api/careers/applications/",
                payload,
                format="multipart",
            )

        self.assertEqual(response.status_code, 201)
        self.assertNotIn("resume", response.data)
        self.assertEqual(response.data["job_posting"], job.slug)
        send_emails.assert_called_once()

    def test_old_incorrect_public_paths_are_not_registered(self):
        self.assertEqual(self.client.post("/api/contact/quote-request/").status_code, 404)
        self.assertEqual(self.client.post("/api/contact/applications/").status_code, 404)

    def test_url_names_resolve_to_expected_paths(self):
        self.assertEqual(reverse("contact:contact-submission-create"), "/api/contact/")
        self.assertEqual(reverse("contact:quote-request-create"), "/api/quote-request/")
        self.assertEqual(
            reverse("contact:job-application-create"),
            "/api/careers/applications/",
        )
        self.assertIs(resolve("/api/contact/").func.view_class, ContactSubmissionCreateView)

    def test_public_permissions_are_explicit(self):
        for view in (
            ContactSubmissionCreateView,
            QuoteRequestCreateView,
            JobApplicationCreateView,
        ):
            self.assertEqual(view.permission_classes, (AllowAny,))

    def test_invalid_subject_choice_consent_and_service_are_field_errors(self):
        contact_response = self.client.post(
            "/api/contact/",
            {
                "first_name": "A",
                "last_name": "B",
                "email": "a@example.com",
                "subject": "x" * 201,
                "message": "Hello",
            },
            format="json",
        )
        quote_response = self.client.post(
            "/api/quote-request/",
            self.quote_values(
                service_type="made-up-service",
                project_size="invalid",
                consent=False,
            ),
            format="multipart",
        )

        self.assertEqual(contact_response.status_code, 400)
        self.assertIn("subject", contact_response.data)
        self.assertEqual(quote_response.status_code, 400)
        self.assertIn("service_type", quote_response.data)
        self.assertIn("project_size", quote_response.data)
        self.assertIn("consent", quote_response.data)

    def test_closed_inactive_and_unknown_jobs_are_rejected(self):
        closed = self.create_job(status=JobPosting.Status.CLOSED)
        inactive_category = JobCategory.objects.create(
            name="Inactive Category",
            is_active=False,
        )
        inactive = self.create_job(category=inactive_category)

        for slug in (closed.slug, inactive.slug, "missing-job"):
            response = self.client.post(
                "/api/careers/applications/",
                self.application_values(slug),
                format="multipart",
            )
            self.assertEqual(response.status_code, 400)
            self.assertIn("job_posting", response.data)


class ModelValidationTests(ContactFactoriesMixin, TestCase):
    def test_direct_contact_save_enforces_field_lengths(self):
        with self.assertRaises(ValidationError):
            ContactSubmission.objects.create(
                first_name="A",
                last_name="B",
                email="valid@example.com",
                subject="x" * 201,
                message="Hello",
            )

    def test_direct_quote_save_enforces_choices_consent_and_active_service(self):
        for changes in (
            {"project_size": "invalid"},
            {"consent": False},
            {"service_type": "not-a-service"},
        ):
            with self.assertRaises(ValidationError):
                QuoteRequest.objects.create(**self.quote_values(**changes))

    def test_active_service_slug_and_special_values_are_accepted(self):
        category = ServiceCategory.objects.create(name="Drainage")
        Service.objects.bulk_create(
            [
                Service(
                    category=category,
                    name="French Drains",
                    slug="french-drains",
                    subtitle="Drainage help",
                    overview="Overview",
                    process_description="Process",
                    primary_image="unused-primary.jpg",
                    primary_image_alt="Primary",
                    supporting_image_one="unused-one.jpg",
                    supporting_image_one_alt="One",
                    supporting_image_two="unused-two.jpg",
                    supporting_image_two_alt="Two",
                    is_active=True,
                ),
                Service(
                    category=category,
                    name="Inactive Service",
                    slug="inactive-service",
                    subtitle="Inactive",
                    overview="Overview",
                    process_description="Process",
                    primary_image="unused-primary-2.jpg",
                    primary_image_alt="Primary",
                    supporting_image_one="unused-one-2.jpg",
                    supporting_image_one_alt="One",
                    supporting_image_two="unused-two-2.jpg",
                    supporting_image_two_alt="Two",
                    is_active=False,
                ),
            ]
        )

        for service_type in ("french-drains", "multiple-services", "not-sure"):
            QuoteRequest.objects.create(**self.quote_values(service_type=service_type))

        with self.assertRaises(ValidationError):
            QuoteRequest.objects.create(
                **self.quote_values(service_type="inactive-service")
            )

    def test_historical_service_snapshot_can_be_saved_after_deactivation(self):
        category = ServiceCategory.objects.create(name="Cleanup")
        Service.objects.bulk_create(
            [
                Service(
                    category=category,
                    name="Lot Cleanup",
                    slug="lot-cleanup",
                    subtitle="Cleanup",
                    overview="Overview",
                    process_description="Process",
                    primary_image="unused-primary.jpg",
                    primary_image_alt="Primary",
                    supporting_image_one="unused-one.jpg",
                    supporting_image_one_alt="One",
                    supporting_image_two="unused-two.jpg",
                    supporting_image_two_alt="Two",
                    is_active=True,
                )
            ]
        )
        quote = QuoteRequest.objects.create(
            **self.quote_values(service_type="lot-cleanup")
        )
        Service.objects.filter(slug="lot-cleanup").update(is_active=False)
        quote.city = "Bloomington"
        quote.save()

    def test_direct_application_rejects_closed_job_and_invalid_choice(self):
        closed = self.create_job(status=JobPosting.Status.CLOSED)

        with self.assertRaises(ValidationError):
            JobApplication.objects.create(**self.application_values(closed))

        open_job = self.create_job()

        with self.assertRaises(ValidationError):
            JobApplication.objects.create(
                **self.application_values(open_job, availability="invalid")
            )

    def test_existing_application_remains_editable_after_job_closes(self):
        job = self.create_job()
        application = JobApplication.objects.create(
            **self.application_values(job)
        )
        job.status = JobPosting.Status.CLOSED
        job.save(update_fields={"status"})
        application.status = JobApplication.Status.REVIEWING
        application.save()

    def test_quote_consent_database_constraint_catches_bypasses(self):
        invalid = QuoteRequest(**self.quote_values(consent=False))

        with self.assertRaises(IntegrityError), transaction.atomic():
            QuoteRequest.objects.bulk_create([invalid])

    def test_deterministic_ordering_uses_primary_key_tiebreaker(self):
        first = ContactSubmission.objects.create(
            first_name="A",
            last_name="One",
            email="a@example.com",
            subject="First",
            message="Hello",
        )
        second = ContactSubmission.objects.create(
            first_name="B",
            last_name="Two",
            email="b@example.com",
            subject="Second",
            message="Hello",
        )
        same_time = timezone.now()
        ContactSubmission.objects.filter(pk__in=(first.pk, second.pk)).update(
            created_at=same_time
        )
        self.assertEqual(
            list(ContactSubmission.objects.values_list("pk", flat=True)),
            [second.pk, first.pk],
        )

    def test_application_protects_job_deletion(self):
        job = self.create_job()
        JobApplication.objects.create(**self.application_values(job))

        with self.assertRaises(ProtectedError):
            job.delete()


class UploadValidationTests(PrivateStorageTestMixin, ContactFactoriesMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.quote = QuoteRequest.objects.create(**self.quote_values())

    def test_direct_photo_save_rejects_empty_oversized_malformed_and_mismatch(self):
        invalid_files = (
            SimpleUploadedFile("empty.png", b""),
            SimpleUploadedFile("large.png", b"x" * (10 * 1024 * 1024 + 1)),
            SimpleUploadedFile("bad.png", b"not an image"),
            make_image("wrong.jpg", image_format="PNG"),
            make_image("wrong.gif", image_format="GIF"),
        )

        for uploaded_file in invalid_files:
            with self.subTest(uploaded_file.name), self.assertRaises(ValidationError):
                QuoteRequestPhoto.objects.create(
                    quote_request=self.quote,
                    image=uploaded_file,
                )

    def test_photo_pixel_limit(self):
        with mock.patch("contact.validators.MAX_PHOTO_PIXELS", 1):
            with self.assertRaises(ValidationError):
                validate_quote_photo(make_image(size=(2, 1)))

    def test_heif_photo_is_decoded_when_extension_matches(self):
        heif = make_image("photo.heic", image_format="HEIF")
        validate_quote_photo(heif)

    def test_direct_photo_count_limit(self):
        for number in range(MAX_QUOTE_REQUEST_PHOTOS):
            QuoteRequestPhoto.objects.create(
                quote_request=self.quote,
                image=make_image(f"photo-{number}.png"),
            )

        with self.assertRaises(ValidationError):
            QuoteRequestPhoto.objects.create(
                quote_request=self.quote,
                image=make_image("photo-six.png"),
            )

    def test_resume_signatures_and_safe_docx(self):
        for resume in (
            make_resume(),
            make_resume(
                "resume.doc",
                b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1more",
            ),
            make_docx(),
        ):
            validate_resume_contents(resume)

    def test_resume_rejects_mismatch_and_unsafe_docx_archive(self):
        for resume in (
            make_resume("fake.pdf", b"not a pdf"),
            make_resume("fake.doc", b"not a doc"),
            make_docx(bomb=True),
        ):
            with self.assertRaises(ValidationError):
                validate_resume_contents(resume)

    def test_direct_application_rejects_resume_extension_size_and_contents(self):
        job = self.create_job()
        invalid_resumes = (
            make_resume("resume.txt"),
            make_resume("resume.pdf", b"not a pdf"),
            make_resume(
                "resume.pdf",
                b"%PDF-" + b"x" * (10 * 1024 * 1024),
            ),
        )

        for resume in invalid_resumes:
            with self.subTest(resume.name), self.assertRaises(ValidationError):
                JobApplication.objects.create(
                    **self.application_values(job, resume=resume)
                )

    def test_serializer_rolls_back_records_and_first_file_when_second_save_fails(self):
        serializer = QuoteRequestSerializer(
            data={
                **self.quote_values(email="rollback@example.com"),
                "photos": [make_image("one.png"), make_image("two.png")],
            }
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        original_save = QuoteRequestPhoto.save
        calls = 0

        def fail_second(photo, *args, **kwargs):
            nonlocal calls
            calls += 1

            if calls == 2:
                raise RuntimeError("simulated second-photo failure")

            return original_save(photo, *args, **kwargs)

        with mock.patch.object(QuoteRequestPhoto, "save", fail_second):
            with self.assertRaises(RuntimeError):
                serializer.save()

        self.assertFalse(
            QuoteRequest.objects.filter(email="rollback@example.com").exists()
        )
        self.assertEqual(list(Path(private_media_storage.location).rglob("*.*")), [])


class PrivateFileLifecycleTests(
    PrivateStorageTestMixin,
    ContactFactoriesMixin,
    TestCase,
):
    def setUp(self):
        super().setUp()
        self.job = self.create_job()
        self.quote = QuoteRequest.objects.create(**self.quote_values())

    def test_resume_partial_save_does_not_delete_database_file(self):
        application = JobApplication.objects.create(
            **self.application_values(self.job, resume=make_resume("old.pdf"))
        )
        old_name = application.resume.name
        application.resume = make_resume("unsaved-new.pdf")
        application.status = JobApplication.Status.REVIEWING

        with self.captureOnCommitCallbacks(execute=True):
            application.save(update_fields={"status"})

        application.refresh_from_db()
        self.assertEqual(application.resume.name, old_name)
        self.assertTrue(application.resume.storage.exists(old_name))

    def test_resume_replacement_and_deletion_clean_files_after_commit(self):
        application = JobApplication.objects.create(
            **self.application_values(self.job, resume=make_resume("old.pdf"))
        )
        old_name = application.resume.name
        application.resume = make_resume("new.pdf")

        with self.captureOnCommitCallbacks(execute=True):
            application.save()

        new_name = application.resume.name
        self.assertFalse(application.resume.storage.exists(old_name))
        self.assertTrue(application.resume.storage.exists(new_name))

        with self.captureOnCommitCallbacks(execute=True):
            application.delete()

        self.assertFalse(private_media_storage.exists(new_name))

    def test_photo_replacement_and_deletion_clean_files_after_commit(self):
        photo = QuoteRequestPhoto.objects.create(
            quote_request=self.quote,
            image=make_image("old.png"),
        )
        old_name = photo.image.name
        photo.image = make_image("new.png")

        with self.captureOnCommitCallbacks(execute=True):
            photo.save()

        new_name = photo.image.name
        self.assertFalse(private_media_storage.exists(old_name))
        self.assertTrue(private_media_storage.exists(new_name))

        with self.captureOnCommitCallbacks(execute=True):
            photo.delete()

        self.assertFalse(private_media_storage.exists(new_name))


class PrivateDownloadTests(
    PrivateStorageTestMixin,
    ContactFactoriesMixin,
    TestCase,
):
    def setUp(self):
        super().setUp()
        self.user = get_user_model().objects.create_user(
            username="staff",
            password="test-password",
            is_staff=True,
        )
        self.job = self.create_job()
        self.application = JobApplication.objects.create(
            **self.application_values(
                self.job,
                resume=make_resume("Peter Resume.pdf"),
            )
        )
        quote = QuoteRequest.objects.create(**self.quote_values())
        self.photo = QuoteRequestPhoto.objects.create(
            quote_request=quote,
            image=make_image("customer-photo.png"),
        )

    def test_anonymous_private_download_redirects_to_login(self):
        response = self.client.get(
            reverse(
                "contact:job-application-resume-download",
                args=(self.application.pk,),
            )
        )
        self.assertEqual(response.status_code, 302)

    def test_staff_download_has_safe_filename_and_security_headers(self):
        self.client.force_login(self.user)
        response = self.client.get(
            reverse(
                "contact:job-application-resume-download",
                args=(self.application.pk,),
            )
        )
        content = b"".join(response.streaming_content)

        self.assertEqual(response.status_code, 200)
        self.assertIn("attachment", response["Content-Disposition"])
        self.assertIn(
            Path(self.application.resume.name).name,
            response["Content-Disposition"],
        )
        self.assertEqual(response["Cache-Control"], "private, no-store")
        self.assertEqual(response["X-Content-Type-Options"], "nosniff")
        self.assertTrue(content.startswith(b"%PDF-"))

    def test_missing_record_and_missing_file_return_404(self):
        self.client.force_login(self.user)
        missing_record = self.client.get(
            reverse("contact:quote-request-photo-download", args=(999_999,))
        )
        private_media_storage.delete(self.photo.image.name)
        missing_file = self.client.get(
            reverse(
                "contact:quote-request-photo-download",
                args=(self.photo.pk,),
            )
        )
        self.assertEqual(missing_record.status_code, 404)
        self.assertEqual(missing_file.status_code, 404)


class EmailAndThrottleTests(TestCase):
    @mock.patch("contact.views.send_contact_confirmation")
    @mock.patch("contact.views.send_contact_notification")
    def test_customer_email_is_attempted_when_owner_email_fails(
        self,
        owner_notification,
        customer_confirmation,
    ):
        owner_notification.side_effect = RuntimeError("mail provider failure")
        submission = mock.Mock(pk=12)
        _send_contact_emails(submission)
        owner_notification.assert_called_once_with(submission)
        customer_confirmation.assert_called_once_with(submission)

    @override_settings(
        REST_FRAMEWORK={
            "NUM_PROXIES": 0,
            "DEFAULT_THROTTLE_RATES": {
                "contact_submission_burst": "10/minute",
                "quote_request_burst": "10/minute",
                "job_application_burst": "10/minute",
            },
        }
    )
    def test_each_form_uses_an_independent_throttle_cache_key(self):
        request = Request(
            APIRequestFactory().post(
                "/api/contact/",
                REMOTE_ADDR="203.0.113.10",
            )
        )
        keys = {
            throttle().get_cache_key(request, None)
            for throttle in (
                ContactSubmissionBurstThrottle,
                QuoteRequestBurstThrottle,
                JobApplicationBurstThrottle,
            )
        }
        self.assertEqual(len(keys), 3)

    @override_settings(
        REST_FRAMEWORK={
            "NUM_PROXIES": 0,
            "DEFAULT_THROTTLE_RATES": {
                "contact_submission_burst": "1/minute",
            },
        }
    )
    def test_throttle_rejects_a_request_after_its_rate_is_exhausted(self):
        cache.clear()
        request = Request(
            APIRequestFactory().post(
                "/api/contact/",
                REMOTE_ADDR="203.0.113.11",
            )
        )

        # DRF stores DEFAULT_THROTTLE_RATES on SimpleRateThrottle when the
        # module is imported, so override_settings() does not replace that
        # already-cached class attribute. Patch the mapping used by this
        # throttle to exercise the intended one-request limit deterministically.
        with mock.patch.object(
            ContactSubmissionBurstThrottle,
            "THROTTLE_RATES",
            {"contact_submission_burst": "1/minute"},
        ):
            throttle = ContactSubmissionBurstThrottle()
            self.assertTrue(throttle.allow_request(request, None))
            self.assertFalse(throttle.allow_request(request, None))