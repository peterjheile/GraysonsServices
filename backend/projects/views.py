from django.db.models import Prefetch
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Project, ProjectImage
from .serializers import HomepageFeaturedProjectSerializer, ProjectSerializer


def published_projects():
    project_images = ProjectImage.objects.order_by("display_order", "id")
    return (
        Project.objects.filter(is_published=True)
        .select_related("category")
        .prefetch_related(
            Prefetch("images", queryset=project_images),
        )
        .order_by("display_order", "-completion_year", "title")
    )


class CategoryFilterMixin:
    def filter_category(self, queryset):
        category_slug = self.request.query_params.get("category", "").strip()
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset


class ProjectListView(CategoryFilterMixin, generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        return self.filter_category(published_projects())


class FeaturedProjectListView(CategoryFilterMixin, generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        return self.filter_category(
            published_projects().filter(is_featured=True)
        )


class ProjectDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectSerializer
    permission_classes = (AllowAny,)
    lookup_field = "slug"

    def get_queryset(self):
        return published_projects()


class HomepageFeaturedProjectListView(
    CategoryFilterMixin,
    generics.ListAPIView,
):
    serializer_class = HomepageFeaturedProjectSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        queryset = (
            Project.objects.filter(is_published=True, is_featured=True)
            .select_related("category")
            .prefetch_related(
                Prefetch(
                    "images",
                    queryset=ProjectImage.objects.order_by(
                        "display_order",
                        "id",
                    ),
                ),
            )
            .order_by("display_order", "-completion_year", "title")
        )
        return self.filter_category(queryset)