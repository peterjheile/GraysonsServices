from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone


class EmailDeliveryError(RuntimeError):
    pass


def _notification_email(setting_name):
    recipient = str(
        getattr(settings, setting_name, "") or ""
    ).strip()

    if not recipient:
        raise ImproperlyConfigured(
            f"{setting_name} must be configured."
        )

    return recipient


def _localize(value):
    if timezone.is_aware(value):
        return timezone.localtime(value)

    return value


def _send_templated_email(
    *,
    subject,
    template_name,
    context,
    recipients,
    reply_to,
):
    template_path = f"contact/emails/{template_name}"

    text_body = render_to_string(
        f"{template_path}.txt",
        context,
    ).strip()

    html_body = render_to_string(
        f"{template_path}.html",
        context,
    )

    message = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=recipients,
        reply_to=reply_to,
    )
    message.attach_alternative(html_body, "text/html")

    delivered = message.send(fail_silently=False)

    if delivered != 1:
        raise EmailDeliveryError(
            f"The email backend reported {delivered} delivered messages."
        )


def _format_money(value):
    value = Decimal(value)
    formatted = f"{value:,.2f}".rstrip("0").rstrip(".")
    return f"${formatted}"


def _job_pay_range(job_posting):
    if job_posting.pay_min is None or job_posting.pay_max is None:
        return "Not listed"

    return (
        f"{_format_money(job_posting.pay_min)}–"
        f"{_format_money(job_posting.pay_max)} "
        f"{job_posting.get_pay_unit_display().lower()}"
    )


def send_contact_notification(submission):
    full_name = (
        f"{submission.first_name} {submission.last_name}"
    ).strip()

    _send_templated_email(
        subject=f"New contact submission from {full_name}",
        template_name="contact_submission",
        context={
            "submission": submission,
            "full_name": full_name,
            "submitted_at": _localize(
                submission.created_at
            ),
        },
        recipients=[
            _notification_email(
                "CONTACT_NOTIFICATION_EMAIL"
            )
        ],
        reply_to=[submission.email],
    )


def send_contact_confirmation(submission):
    owner_email = _notification_email(
        "CONTACT_NOTIFICATION_EMAIL"
    )

    _send_templated_email(
        subject=(
            "We received your message | "
            "Grayson's Services"
        ),
        template_name="contact_confirmation",
        context={
            "submission": submission,
        },
        recipients=[submission.email],
        reply_to=[owner_email],
    )


def send_quote_request_notification(submission):
    full_name = (
        f"{submission.first_name} {submission.last_name}"
    ).strip()

    service_label = (
        submission.service_type
        .replace("-", " ")
        .title()
    )

    _send_templated_email(
        subject=f"New estimate request from {full_name}",
        template_name="quote_request_submission",
        context={
            "submission": submission,
            "full_name": full_name,
            "service_label": service_label,
            "photo_count": submission.photos.count(),
            "submitted_at": _localize(
                submission.created_at
            ),
        },
        recipients=[
            _notification_email(
                "QUOTE_NOTIFICATION_EMAIL"
            )
        ],
        reply_to=[submission.email],
    )


def send_quote_request_confirmation(submission):
    owner_email = _notification_email(
        "QUOTE_NOTIFICATION_EMAIL"
    )

    service_label = (
        submission.service_type
        .replace("-", " ")
        .title()
    )

    _send_templated_email(
        subject=(
            "We received your estimate request | "
            "Grayson's Services"
        ),
        template_name="quote_request_confirmation",
        context={
            "submission": submission,
            "service_label": service_label,
            "photo_count": submission.photos.count(),
        },
        recipients=[submission.email],
        reply_to=[owner_email],
    )


def send_job_application_notification(application):
    full_name = (
        f"{application.first_name} {application.last_name}"
    ).strip()
    job_posting = application.job_posting

    _send_templated_email(
        subject=(
            f"New application for {job_posting.title} "
            f"from {full_name}"
        ),
        template_name="job_application_submission",
        context={
            "application": application,
            "full_name": full_name,
            "job_posting": job_posting,
            "pay_range_label": _job_pay_range(job_posting),
            "resume_uploaded": bool(
                application.resume and application.resume.name
            ),
            "submitted_at": _localize(
                application.created_at
            ),
        },
        recipients=[
            _notification_email(
                "CAREERS_NOTIFICATION_EMAIL"
            )
        ],
        reply_to=[application.email],
    )


def send_job_application_confirmation(application):
    owner_email = _notification_email(
        "CAREERS_NOTIFICATION_EMAIL"
    )
    job_posting = application.job_posting

    _send_templated_email(
        subject=(
            "We received your application | "
            "Grayson's Services"
        ),
        template_name="job_application_confirmation",
        context={
            "application": application,
            "job_posting": job_posting,
            "pay_range_label": _job_pay_range(job_posting),
            "resume_uploaded": bool(
                application.resume and application.resume.name
            ),
        },
        recipients=[application.email],
        reply_to=[owner_email],
    )
