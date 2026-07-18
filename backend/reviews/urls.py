from django.urls import path

from .views import (
    HomepageReviewListView,
    ReviewListView,
)


app_name = "reviews"


urlpatterns = [
    path(
        "reviews/",
        ReviewListView.as_view(),
        name="review-list",
    ),
    path(
        "reviews/homepage/",
        HomepageReviewListView.as_view(),
        name="homepage-review-list",
    ),
]