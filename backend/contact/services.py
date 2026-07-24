from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone


def send_contact_notification(submission):
    full_name = f"{submission.first_name} {submission.last_name}".strip()
    safe_subject = " ".join(submission.subject.split())
    submitted_at = timezone.localtime(submission.created_at)

    context = {
        "submission": submission,
        "full_name": full_name,
        "submitted_at": submitted_at,
    }

    text_body = render_to_string(
        "contact/emails/contact_submission.txt",
        context,
    )

    html_body = render_to_string(
        "contact/emails/contact_submission.html",
        context,
    )

    email = EmailMultiAlternatives(
        subject=f"New contact submission: {safe_subject}",
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[settings.CONTACT_NOTIFICATION_EMAIL],
        reply_to=[submission.email],
    )

    email.attach_alternative(html_body, "text/html")
    email.send(fail_silently=False)




def send_contact_confirmation(submission):
    full_name = f"{submission.first_name} {submission.last_name}".strip()

    context = {
        "submission": submission,
        "full_name": full_name,
    }

    text_body = render_to_string(
        "contact/emails/contact_confirmation.txt",
        context,
    )

    html_body = render_to_string(
        "contact/emails/contact_confirmation.html",
        context,
    )

    email = EmailMultiAlternatives(
        subject="We received your message | Grayson's Services",
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[submission.email],
        reply_to=[settings.CONTACT_NOTIFICATION_EMAIL],
    )

    email.attach_alternative(html_body, "text/html")
    email.send(fail_silently=False)