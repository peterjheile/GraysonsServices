from django.db.models import Prefetch
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Project, ProjectImage
from .serializers import (
    HomepageProjectImageSerializer,
    ProjectCardSerializer,
    ProjectDetailSerializer,
)


class HomepageProjectImageListView(generics.ListAPIView):
    """
    Return every image selected for the homepage.

    There is intentionally no hard-coded limit. The admin controls
    how many images appear using show_on_homepage.
    """

    serializer_class = HomepageProjectImageSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        return (
            ProjectImage.objects.filter(
                show_on_homepage=True,
                project__is_published=True,
            )
            .select_related(
                "project",
                "project__category",
            )
            .order_by(
                "homepage_order",
                "id",
            )
        )


class ProjectListView(generics.ListAPIView):
    """
    Return lightweight project cards for the complete Projects page.

    Optional category filtering:
    /api/projects/?category=decks
    """

    serializer_class = ProjectCardSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        images = ProjectImage.objects.order_by(
            "display_order",
            "id",
        )

        queryset = (
            Project.objects.filter(
                is_published=True,
            )
            .select_related("category")
            .prefetch_related(
                Prefetch(
                    "images",
                    queryset=images,
                )
            )
        )

        category_slug = self.request.query_params.get("category")

        if category_slug:
            queryset = queryset.filter(
                category__slug=category_slug,
            )

        return queryset.order_by(
            "-is_featured",
            "featured_order",
            "display_order",
            "title",
        )


class FeaturedProjectListView(generics.ListAPIView):
    """
    Return complete case-study information for published featured projects.

    Optional category filtering:
    /api/projects/featured/?category=retaining-walls
    """

    serializer_class = ProjectDetailSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        images = ProjectImage.objects.order_by(
            "display_order",
            "id",
        )

        queryset = (
            Project.objects.filter(
                is_published=True,
                is_featured=True,
            )
            .select_related("category")
            .prefetch_related(
                Prefetch(
                    "images",
                    queryset=images,
                )
            )
        )

        category_slug = self.request.query_params.get("category")

        if category_slug:
            queryset = queryset.filter(
                category__slug=category_slug,
            )

        return queryset.order_by(
            "featured_order",
            "title",
        )


class ProjectDetailView(generics.RetrieveAPIView):
    """
    Return one complete published project using its slug.
    """

    serializer_class = ProjectDetailSerializer
    permission_classes = (AllowAny,)
    lookup_field = "slug"

    def get_queryset(self):
        images = ProjectImage.objects.order_by(
            "display_order",
            "id",
        )

        return (
            Project.objects.filter(
                is_published=True,
            )
            .select_related("category")
            .prefetch_related(
                Prefetch(
                    "images",
                    queryset=images,
                )
            )
        )