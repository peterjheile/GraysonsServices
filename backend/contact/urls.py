from django.urls import path

from .views import ContactSubmissionCreateView


app_name = "contact"

urlpatterns = [
    path(
        "contact/",
        ContactSubmissionCreateView.as_view(),
        name="contact-submission-create",
    ),
]