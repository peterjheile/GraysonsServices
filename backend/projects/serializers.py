from rest_framework import serializers

from .models import Project, ProjectImage


class ProjectReferenceSerializer(serializers.ModelSerializer):
    """
    Lightweight project information nested inside a homepage image.
    """

    category = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    category_slug = serializers.CharField(
        source="category.slug",
        read_only=True,
    )

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "slug",
            "category",
            "category_slug",
            "location",
        )


class HomepageProjectImageSerializer(serializers.ModelSerializer):
    """
    Images selected for the homepage masonry gallery.
    """

    image_url = serializers.ImageField(
        source="image",
        read_only=True,
    )

    project = ProjectReferenceSerializer(
        read_only=True,
    )

    class Meta:
        model = ProjectImage
        fields = (
            "id",
            "image_url",
            "alt_text",
            "caption",
            "image_type",
            "is_cover",
            "show_on_homepage",
            "homepage_order",
            "homepage_size",
            "display_order",
            "project",
        )


class ProjectCardImageSerializer(serializers.ModelSerializer):
    """
    Small image representation used for project cards.
    """

    image_url = serializers.ImageField(
        source="image",
        read_only=True,
    )

    class Meta:
        model = ProjectImage
        fields = (
            "id",
            "image_url",
            "alt_text",
        )


class ProjectImageSerializer(serializers.ModelSerializer):
    """
    Complete image information for a project detail or case-study view.
    """

    image_url = serializers.ImageField(
        source="image",
        read_only=True,
    )

    class Meta:
        model = ProjectImage
        fields = (
            "id",
            "image_url",
            "alt_text",
            "caption",
            "image_type",
            "is_cover",
            "display_order",
        )


class ProjectCardSerializer(serializers.ModelSerializer):
    """
    Lightweight project representation for the regular Projects grid.
    """

    category = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    category_slug = serializers.CharField(
        source="category.slug",
        read_only=True,
    )

    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "slug",
            "category",
            "category_slug",
            "location",
            "completion_year",
            "short_description",
            "is_featured",
            "featured_order",
            "display_order",
            "cover_image",
        )

    def get_cover_image(self, obj):
        images = list(obj.images.all())

        cover_image = next(
            (image for image in images if image.is_cover),
            None,
        )

        # Fall back to the first image if no cover was selected.
        if cover_image is None and images:
            cover_image = images[0]

        if cover_image is None:
            return None

        return ProjectCardImageSerializer(
            cover_image,
            context=self.context,
        ).data


class ProjectDetailSerializer(serializers.ModelSerializer):
    """
    Complete project information for featured case studies and detail pages.
    """

    category = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    category_slug = serializers.CharField(
        source="category.slug",
        read_only=True,
    )

    materials = serializers.SerializerMethodField()

    images = ProjectImageSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "slug",
            "category",
            "category_slug",
            "location",
            "completion_year",
            "short_description",
            "duration",
            "area",
            "challenge",
            "approach",
            "result",
            "materials",
            "is_featured",
            "featured_order",
            "display_order",
            "images",
            "updated_at",
        )

    def get_materials(self, obj):
        if not obj.materials:
            return []

        return [
            material.strip()
            for material in obj.materials.splitlines()
            if material.strip()
        ]