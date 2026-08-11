from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.utils.html import format_html
from unfold.admin import ModelAdmin, StackedInline

from .models import Project, ProjectImage


class ProjectImageInlineFormSet(forms.BaseInlineFormSet):
    def clean(self):
        super().clean()
        if any(self.errors):
            return

        active_forms = [
            form
            for form in self.forms
            if form.cleaned_data
            and not form.cleaned_data.get("DELETE", False)
            and form.cleaned_data.get("image")
        ]
        image_count = len(active_forms)
        if image_count == 0:
            raise ValidationError(
                "Every project must have at least one image."
            )
        if self.instance.is_featured and image_count < 3:
            raise ValidationError(
                "Featured projects must have at least three images."
            )

        cover_count = sum(
            bool(form.cleaned_data.get("is_cover"))
            for form in active_forms
        )
        before_count = sum(
            form.cleaned_data.get("role") == ProjectImage.Role.BEFORE
            for form in active_forms
        )
        after_count = sum(
            form.cleaned_data.get("role") == ProjectImage.Role.AFTER
            for form in active_forms
        )
        if cover_count > 1:
            raise ValidationError(
                "A project can only have one cover image."
            )
        if before_count > 1:
            raise ValidationError(
                "A project can only have one before image."
            )
        if after_count > 1:
            raise ValidationError(
                "A project can only have one after image."
            )
        if before_count != after_count:
            raise ValidationError(
                "A before-and-after comparison requires both a before "
                "image and an after image."
            )

    def save_new(self, form, commit=True):
        form.instance._skip_image_set_validation = True
        try:
            return super().save_new(form, commit=commit)
        finally:
            form.instance._skip_image_set_validation = False

    def save_existing(self, form, instance, commit=True):
        instance._skip_image_set_validation = True
        try:
            return super().save_existing(form, instance, commit=commit)
        finally:
            instance._skip_image_set_validation = False

    def delete_existing(self, obj, commit=True):
        obj._skip_image_set_validation = True
        try:
            return super().delete_existing(obj, commit=commit)
        finally:
            obj._skip_image_set_validation = False


class ProjectImageInline(StackedInline):
    model = ProjectImage
    formset = ProjectImageInlineFormSet
    extra = 1
    show_change_link = True
    fields = (
        "image_preview",
        "image",
        "alt_text",
        "caption",
        "role",
        "is_cover",
        "display_order",
    )
    readonly_fields = ("image_preview",)
    ordering = ("display_order", "id")

    @admin.display(description="Current image")
    def image_preview(self, obj):
        if not obj.pk or not obj.image:
            return "Upload an image to see its preview."
        return format_html(
            '<img src="{}" alt="{}" style="width:240px;height:160px;'
            'object-fit:cover;border-radius:8px;">',
            obj.image.url,
            obj.alt_text or "",
        )


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    inlines = (ProjectImageInline,)
    list_display = (
        "title",
        "category",
        "project_type",
        "is_published",
        "display_order",
        "image_count",
        "updated_at",
    )
    # Publishing is intentionally done on the edit page so the inline image
    # collection can be validated at the same time.
    list_editable = ("display_order",)
    list_filter = (
        "is_featured",
        "is_published",
        "category",
        "completion_year",
    )
    search_fields = (
        "title",
        "caption",
        "location",
        "category__name",
    )
    readonly_fields = ("slug", "created_at", "updated_at")
    fieldsets = (
        (
            "Basic information",
            {
                "fields": ("title", "category", "caption"),
                "description": (
                    "Every project needs a title and at least one image."
                ),
            },
        ),
        (
            "Website display",
            {
                "fields": (
                    "is_featured",
                    "is_published",
                    "homepage_size",
                    "display_order",
                ),
                "description": (
                    "Featured projects use the detailed case-study layout "
                    "and require at least three images. Homepage size "
                    "controls the featured-project card layout."
                ),
            },
        ),
        (
            "Featured project details",
            {
                "fields": (
                    "location",
                    "completion_year",
                    "duration",
                    "area",
                    "challenge",
                    "approach",
                    "result",
                    "materials",
                ),
                "classes": ("collapse",),
                "description": (
                    "Only complete this section for featured projects. "
                    "Challenge, approach, and result are required when "
                    "the project is featured."
                ),
            },
        ),
        (
            "Record information",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )
    ordering = ("display_order", "-completion_year", "title")
    save_on_top = True

    @admin.display(description="Type", ordering="is_featured")
    def project_type(self, obj):
        return "Featured" if obj.is_featured else "Normal"

    @admin.display(description="Images")
    def image_count(self, obj):
        return len(obj.images.all())

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("category")
            .prefetch_related("images")
        )

    def save_model(self, request, obj, form, change):
        # The inline formset validates the final image collection after the
        # parent is saved, including first-time project creation.
        obj._skip_image_set_validation = True
        try:
            super().save_model(request, obj, form, change)
        finally:
            obj._skip_image_set_validation = False


@admin.register(ProjectImage)
class ProjectImageAdmin(ModelAdmin):
    list_display = (
        "image_preview",
        "project",
        "role",
        "is_cover",
        "display_order",
    )
    list_editable = ("is_cover", "display_order")
    list_filter = ("role", "is_cover")
    search_fields = ("project__title", "alt_text", "caption")
    autocomplete_fields = ("project",)
    readonly_fields = ("image_preview", "created_at", "updated_at")
    fieldsets = (
        (
            "Image",
            {
                "fields": (
                    "image_preview",
                    "image",
                    "project",
                    "alt_text",
                    "caption",
                )
            },
        ),
        (
            "Image usage",
            {"fields": ("role", "is_cover", "display_order")},
        ),
        (
            "Record information",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )
    ordering = ("project", "display_order", "id")
    list_select_related = ("project",)
    save_on_top = True

    @admin.display(description="Preview")
    def image_preview(self, obj):
        if not obj.pk or not obj.image:
            return "No image"
        return format_html(
            '<img src="{}" alt="{}" style="width:120px;height:80px;'
            'object-fit:cover;border-radius:8px;">',
            obj.image.url,
            obj.alt_text or "",
        )