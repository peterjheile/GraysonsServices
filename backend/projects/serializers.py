from rest_framework import serializers

from .models import Project, ProjectImage


class ProjectImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProjectImage
        fields = (
            "id",
            "image_url",
            "alt_text",
            "caption",
            "role",
            "is_cover",
            "display_order",
        )

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.image.url)

        return obj.image.url


class ProjectSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    category_slug = serializers.SerializerMethodField()

    images = ProjectImageSerializer(
        many=True,
        read_only=True,
    )

    cover_image = serializers.SerializerMethodField()
    materials = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "id",
            "slug",
            "title",
            "caption",
            "category",
            "category_slug",
            "is_featured",
            "is_published",
            "display_order",

            # Featured-project details
            "location",
            "completion_year",
            "duration",
            "area",
            "challenge",
            "approach",
            "result",
            "materials",

            # Images
            "cover_image",
            "images",
        )

    def get_category(self, obj):
        if not obj.category:
            return None

        return obj.category.name

    def get_category_slug(self, obj):
        if not obj.category:
            return None

        return obj.category.slug

    def get_materials(self, obj):
        return obj.materials_list

    def get_cover_image(self, obj):
        cover_image = obj.cover_image

        if not cover_image:
            return None

        return ProjectImageSerializer(
            cover_image,
            context=self.context,
        ).data




class HomepageFeaturedProjectSerializer(
    serializers.ModelSerializer
):
    category = serializers.CharField(
        source="category.name",
        allow_null=True,
        read_only=True,
    )

    category_slug = serializers.CharField(
        source="category.slug",
        allow_null=True,
        read_only=True,
    )

    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "slug",
            "title",
            "category",
            "category_slug",
            "location",
            "homepage_size",
            "cover_image",
        )

    def get_cover_image(self, obj):
        cover_image = obj.cover_image

        if not cover_image:
            return None

        return ProjectImageSerializer(
            cover_image,
            context=self.context,
        ).data