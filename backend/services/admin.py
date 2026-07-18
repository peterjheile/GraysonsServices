from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline

from .models import (
    Service,
    ServiceCategory,
    ServiceIncludedItem,
)


class ServiceIncludedItemInline(TabularInline):
    model = ServiceIncludedItem
    extra = 0

    fields = (
        "text",
        "display_order",
    )

    ordering = (
        "display_order",
        "id",
    )


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(ModelAdmin):
    exclude = (
        "slug",
    )

    list_display = (
        "name",
        "slug",
        "display_order",
    )

    list_editable = (
        "display_order",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "display_order",
        "name",
    )


@admin.register(Service)
class ServiceAdmin(ModelAdmin):
    inlines = (
        ServiceIncludedItemInline,
    )

    fieldsets = (
        (
            "Service Information",
            {
                "fields": (
                    "category",
                    "name",
                    "subtitle",
                    "overview",
                    "process_description",
                ),
            },
        ),
        (
            "Primary Image",
            {
                "fields": (
                    "primary_image",
                    "primary_image_preview",
                    "primary_image_alt",
                ),
            },
        ),
        (
            "Supporting Images",
            {
                "fields": (
                    (
                        "supporting_image_one",
                        "supporting_image_two",
                    ),
                    (
                        "supporting_image_one_preview",
                        "supporting_image_two_preview",
                    ),
                    (
                        "supporting_image_one_alt",
                        "supporting_image_two_alt",
                    ),
                ),
            },
        ),
        (
            "Display Settings",
            {
                "fields": (
                    "display_order",
                    "is_active",
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
            },
        ),
    )

    readonly_fields = (
        "primary_image_preview",
        "supporting_image_one_preview",
        "supporting_image_two_preview",
        "created_at",
        "updated_at",
    )

    list_display = (
        "name",
        "category",
        "display_order",
        "is_active",
        "updated_at",
    )

    list_editable = (
        "display_order",
        "is_active",
    )

    list_filter = (
        "category",
        "is_active",
    )

    search_fields = (
        "name",
        "subtitle",
        "overview",
        "process_description",
    )

    autocomplete_fields = (
        "category",
    )

    ordering = (
        "display_order",
        "name",
    )

    @admin.display(description="Primary image preview")
    def primary_image_preview(self, obj):
        if not obj or not obj.primary_image:
            return "No image uploaded"

        return format_html(
            '<img src="{}" alt="" '
            'style="width: 100%; max-width: 500px; height: auto; '
            'border-radius: 8px; object-fit: cover;" />',
            obj.primary_image.url,
        )

    @admin.display(description="First supporting image preview")
    def supporting_image_one_preview(self, obj):
        if not obj or not obj.supporting_image_one:
            return "No image uploaded"

        return format_html(
            '<img src="{}" alt="" '
            'style="width: 100%; max-width: 300px; height: auto; '
            'border-radius: 8px; object-fit: cover;" />',
            obj.supporting_image_one.url,
        )

    @admin.display(description="Second supporting image preview")
    def supporting_image_two_preview(self, obj):
        if not obj or not obj.supporting_image_two:
            return "No image uploaded"

        return format_html(
            '<img src="{}" alt="" '
            'style="width: 100%; max-width: 300px; height: auto; '
            'border-radius: 8px; object-fit: cover;" />',
            obj.supporting_image_two.url,
        )