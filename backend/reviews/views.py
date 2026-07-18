from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny

from .models import Review
from .serializers import ReviewSerializer


class ReviewListView(generics.ListAPIView):
    """
    Return all active reviews for the complete Reviews page.

    Optional filters:

    /api/reviews/?category=decks
    /api/reviews/?source=google
    /api/reviews/?category=decks&source=google
    """

    serializer_class = ReviewSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        queryset = (
            Review.objects.filter(
                is_active=True,
            )
            .select_related(
                "category",
                "project",
            )
        )

        category_slug = self.request.query_params.get(
            "category"
        )

        source = self.request.query_params.get(
            "source"
        )

        if category_slug:
            queryset = queryset.filter(
                category__slug=category_slug,
            )

        if source:
            if source not in Review.Source.values:
                raise ValidationError(
                    {
                        "source": (
                            f'Invalid review source "{source}". '
                            "Valid options are: "
                            f"{', '.join(Review.Source.values)}."
                        )
                    }
                )

            queryset = queryset.filter(
                source=source,
            )

        return queryset.order_by(
            "display_order",
            "-review_year",
            "-review_month",
            "reviewer_name",
        )


class HomepageReviewListView(generics.ListAPIView):
    """
    Return active reviews specifically selected for the homepage.

    This includes both regular and featured reviews. The frontend can
    separate them using the is_featured field.
    """

    serializer_class = ReviewSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        return (
            Review.objects.filter(
                is_active=True,
                show_on_homepage=True,
            )
            .select_related(
                "category",
                "project",
            )
            .order_by(
                "homepage_order",
                "-review_year",
                "-review_month",
                "reviewer_name",
            )
        )