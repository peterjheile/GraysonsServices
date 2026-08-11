from django.urls import path

from .views import JobPostingDetailView, JobPostingListView


app_name = "careers"

urlpatterns = [
    path(
        "careers/jobs/",
        JobPostingListView.as_view(),
        name="job-posting-list",
    ),
    path(
        "careers/jobs/<slug:slug>/",
        JobPostingDetailView.as_view(),
        name="job-posting-detail",
    ),
]