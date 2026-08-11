from django.urls import path

from .views import (
    FeaturedProjectListView,
    HomepageFeaturedProjectListView,
    ProjectDetailView,
    ProjectListView,
)


app_name = "projects"


urlpatterns = [
    path(
        "projects/",
        ProjectListView.as_view(),
        name="project-list",
    ),
    path(
        "projects/featured/",
        FeaturedProjectListView.as_view(),
        name="featured-project-list",
    ),
    path(
    "projects/homepage/",
        HomepageFeaturedProjectListView.as_view(),
        name="homepage-featured-project-list",
    ),
    path(
        "projects/<slug:slug>/",
        ProjectDetailView.as_view(),
        name="project-detail",
    ),
]