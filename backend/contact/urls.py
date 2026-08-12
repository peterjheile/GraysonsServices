from django.urls import path

from .views import (
    ContactSubmissionCreateView,
    JobApplicationCreateView,
    QuoteRequestCreateView,
    job_application_resume_download,
    quote_request_photo_download,
)


app_name = "contact"

urlpatterns = [
    path(
        "contact/",
        ContactSubmissionCreateView.as_view(),
        name="contact-submission-create",
    ),
    path(
        "contact/quote-request/",
        QuoteRequestCreateView.as_view(),
        name="quote-request-create",
    ),
    path(
        "contact/careers/applications/",
        JobApplicationCreateView.as_view(),
        name="job-application-create",
    ),
    path(
        "contact/quote-request-photos/<int:photo_id>/download/",
        quote_request_photo_download,
        name="quote-request-photo-download",
    ),
    path(
        "contact/applications/<int:application_id>/resume/download/",
        job_application_resume_download,
        name="job-application-resume-download",
    ),
]
