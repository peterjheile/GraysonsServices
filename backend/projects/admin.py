from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin, StackedInline

from .models import Project, ProjectImage


class ProjectImageInline(StackedInline):
    model = ProjectImage
    extra = 0
    show_change_link = True

    fields = (
        "image",
        "image_preview",
        "alt_text",
        "caption",
        "image_type",
        "is_cover",
        "display_order",
        "show_on_homepage",
        "homepage_order",
        "homepage_size",
    )

    readonly_fields = (
        "image_preview",
    )

    ordering = (
        "display_order",
        "id",
    )

    @admin.display(description="Current Image")
    def image_preview(self, obj):
        if not obj or not obj.image:
            return "No image uploaded"

        return format_html(
            """
            <img
                src="{}"
                alt="{}"
                style="
                    width: 240px;
                    height: 160px;
                    object-fit: cover;
                    border-radius: 6px;
                "
            />
            """,
            obj.image.url,
            obj.alt_text or obj.project.title,
        )


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    inlines = (
        ProjectImageInline,
    )

    exclude = (
        "slug",
    )

    list_display = (
        "cover_preview",
        "title",
        "category",
        "location",
        "completion_year",
        "is_featured",
        "is_published",
        "featured_order",
        "display_order",
    )

    list_display_links = (
        "cover_preview",
        "title",
    )

    list_editable = (
        "is_featured",
        "is_published",
        "featured_order",
        "display_order",
    )

    list_filter = (
        "category",
        "is_featured",
        "is_published",
        "completion_year",
    )

    search_fields = (
        "title",
        "location",
        "short_description",
        "challenge",
        "approach",
        "result",
    )

    ordering = (
        "display_order",
        "-completion_year",
        "title",
    )

    autocomplete_fields = (
        "category",
    )

    readonly_fields = (
        "slug",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Project Information",
            {
                "fields": (
                    "title",
                    "category",
                    "location",
                    "completion_year",
                    "short_description",
                ),
            },
        ),
        (
            "Featured Case Study",
            {
                "description": (
                    "These fields are used when the project receives the "
                    "large featured layout on the Projects page."
                ),
                "fields": (
                    "duration",
                    "area",
                    "challenge",
                    "approach",
                    "result",
                    "materials",
                ),
            },
        ),
        (
            "Website Display",
            {
                "fields": (
                    "is_published",
                    "is_featured",
                    "featured_order",
                    "display_order",
                ),
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "slug",
                    "created_at",
                    "updated_at",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
    )

    @admin.display(description="Cover")
    def cover_preview(self, obj):
        images = list(obj.images.all())

        cover_image = next(
            (image for image in images if image.is_cover),
            None,
        )

        if cover_image is None and images:
            cover_image = images[0]

        if cover_image is None or not cover_image.image:
            return "—"

        return format_html(
            """
            <img
                src="{}"
                alt="{}"
                style="
                    width: 72px;
                    height: 52px;
                    object-fit: cover;
                    border-radius: 5px;
                "
            />
            """,
            cover_image.image.url,
            cover_image.alt_text or obj.title,
        )

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("category")
            .prefetch_related("images")
        )


@admin.register(ProjectImage)
class ProjectImageAdmin(ModelAdmin):
    list_display = (
        "image_preview",
        "project",
        "image_type",
        "is_cover",
        "display_order",
        "show_on_homepage",
        "homepage_order",
        "homepage_size",
    )

    list_display_links = (
        "image_preview",
        "project",
    )

    list_editable = (
        "image_type",
        "is_cover",
        "display_order",
        "show_on_homepage",
        "homepage_order",
        "homepage_size",
    )

    list_filter = (
        "show_on_homepage",
        "is_cover",
        "homepage_size",
        "image_type",
        "project__category",
    )

    search_fields = (
        "project__title",
        "project__location",
        "alt_text",
        "caption",
    )

    autocomplete_fields = (
        "project",
    )

    ordering = (
        "-show_on_homepage",
        "homepage_order",
        "project__title",
        "display_order",
    )

    list_select_related = (
        "project",
        "project__category",
    )

    readonly_fields = (
        "large_image_preview",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Image",
            {
                "fields": (
                    "project",
                    "image",
                    "large_image_preview",
                    "alt_text",
                    "caption",
                    "image_type",
                ),
            },
        ),
        (
            "Project Display",
            {
                "description": (
                    "These settings control how the image is used inside "
                    "its project."
                ),
                "fields": (
                    "is_cover",
                    "display_order",
                ),
            },
        ),
        (
            "Homepage Display",
            {
                "description": (
                    "Enable homepage display to include this exact image "
                    "in the homepage project grid."
                ),
                "fields": (
                    "show_on_homepage",
                    "homepage_order",
                    "homepage_size",
                ),
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
    )

    @admin.display(description="Preview")
    def image_preview(self, obj):
        if not obj.image:
            return "—"

        return format_html(
            """
            <img
                src="{}"
                alt="{}"
                style="
                    width: 72px;
                    height: 52px;
                    object-fit: cover;
                    border-radius: 5px;
                "
            />
            """,
            obj.image.url,
            obj.alt_text or obj.project.title,
        )

    @admin.display(description="Current Image")
    def large_image_preview(self, obj):
        if not obj or not obj.image:
            return "No image uploaded"

        return format_html(
            """
            <img
                src="{}"
                alt="{}"
                style="
                    width: min(100%, 520px);
                    max-height: 340px;
                    object-fit: contain;
                    border-radius: 6px;
                "
            />
            """,
            obj.image.url,
            obj.alt_text or obj.project.title,
        )