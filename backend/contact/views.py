import logging
from pathlib import Path

from django.contrib.admin.views.decorators import staff_member_required
from django.db import transaction
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny

from .models import (
    ContactSubmission,
    JobApplication,
    QuoteRequest,
    QuoteRequestPhoto,
)
from .serializers import (
    ContactSubmissionSerializer,
    JobApplicationSerializer,
    QuoteRequestSerializer,
)
from .services import (
    send_contact_confirmation,
    send_contact_notification,
    send_job_application_confirmation,
    send_job_application_notification,
    send_quote_request_confirmation,
    send_quote_request_notification,
)
from .throttles import (
    ContactSubmissionBurstThrottle,
    ContactSubmissionDailyThrottle,
    JobApplicationBurstThrottle,
    JobApplicationDailyThrottle,
    QuoteRequestBurstThrottle,
    QuoteRequestDailyThrottle,
)


logger = logging.getLogger(__name__)


def _send_independently(*, record, sends):
    for description, send in sends:
        try:
            send(record)
        except Exception:
            logger.exception(
                "Failed to send %s for %s %s",
                description,
                type(record).__name__,
                record.pk,
            )


def _send_contact_emails(submission):
    _send_independently(
        record=submission,
        sends=(
            ("owner notification", send_contact_notification),
            ("customer confirmation", send_contact_confirmation),
        ),
    )


def _send_quote_request_emails(quote_request):
    _send_independently(
        record=quote_request,
        sends=(
            ("owner notification", send_quote_request_notification),
            ("customer confirmation", send_quote_request_confirmation),
        ),
    )


def _send_job_application_emails(application):
    _send_independently(
        record=application,
        sends=(
            ("owner notification", send_job_application_notification),
            ("applicant confirmation", send_job_application_confirmation),
        ),
    )


class ContactSubmissionCreateView(CreateAPIView):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    permission_classes = (AllowAny,)
    throttle_classes = (
        ContactSubmissionBurstThrottle,
        ContactSubmissionDailyThrottle,
    )

    def perform_create(self, serializer):
        with transaction.atomic():
            submission = serializer.save()
            transaction.on_commit(
                lambda: _send_contact_emails(submission),
                using=submission._state.db,
            )


class QuoteRequestCreateView(CreateAPIView):
    queryset = QuoteRequest.objects.all()
    serializer_class = QuoteRequestSerializer
    permission_classes = (AllowAny,)
    throttle_classes = (
        QuoteRequestBurstThrottle,
        QuoteRequestDailyThrottle,
    )
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        with transaction.atomic():
            quote_request = serializer.save()
            transaction.on_commit(
                lambda: _send_quote_request_emails(quote_request),
                using=quote_request._state.db,
            )


class JobApplicationCreateView(CreateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = (AllowAny,)
    throttle_classes = (
        JobApplicationBurstThrottle,
        JobApplicationDailyThrottle,
    )
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        with transaction.atomic():
            application = serializer.save()
            transaction.on_commit(
                lambda: _send_job_application_emails(application),
                using=application._state.db,
            )


def _private_file_response(field_file, *, missing_message):
    if not field_file or not field_file.name:
        raise Http404(missing_message)

    try:
        file_handle = field_file.open("rb")
    except (FileNotFoundError, OSError) as exc:
        raise Http404(missing_message) from exc

    response = FileResponse(
        file_handle,
        as_attachment=True,
        filename=Path(field_file.name).name,
    )
    response["Cache-Control"] = "private, no-store"
    response["X-Content-Type-Options"] = "nosniff"
    return response


@staff_member_required
@require_GET
def quote_request_photo_download(request, photo_id):
    photo = get_object_or_404(QuoteRequestPhoto, pk=photo_id)
    return _private_file_response(
        photo.image,
        missing_message="Photo file not found.",
    )


@staff_member_required
@require_GET
def job_application_resume_download(request, application_id):
    application = get_object_or_404(JobApplication, pk=application_id)
    return _private_file_response(
        application.resume,
        missing_message="Résumé file not found.",
    )
