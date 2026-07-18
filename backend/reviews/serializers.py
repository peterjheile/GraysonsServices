from rest_framework import serializers

from projects.models import Project

from .models import Review


class ReviewProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "slug",
        )


class ReviewSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.ImageField(
        source="profile_image",
        read_only=True,
        allow_null=True,
    )

    initials = serializers.CharField(
        read_only=True,
    )

    source_label = serializers.CharField(
        source="get_source_display",
        read_only=True,
    )

    category = serializers.CharField(
        source="category.name",
        read_only=True,
        allow_null=True,
    )

    category_slug = serializers.CharField(
        source="category.slug",
        read_only=True,
        allow_null=True,
    )

    project = ReviewProjectSerializer(
        read_only=True,
        allow_null=True,
    )

    review_month_name = serializers.CharField(
        source="get_review_month_display",
        read_only=True,
    )

    review_date_label = serializers.CharField(
        source="formatted_review_date",
        read_only=True,
    )

    class Meta:
        model = Review
        fields = (
            "id",
            "reviewer_name",
            "initials",
            "role",
            "quote",
            "rating",
            "source",
            "source_label",
            "category",
            "category_slug",
            "project",
            "profile_image_url",
            "review_month",
            "review_month_name",
            "review_year",
            "review_date_label",
            "show_on_homepage",
            "is_featured",
            "homepage_order",
            "display_order",
            "updated_at",
        )