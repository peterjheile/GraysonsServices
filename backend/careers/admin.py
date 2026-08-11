from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline

from .models import (
    JobCategory,
    JobNiceToHave,
    JobPosting,
    JobRequirement,
    JobResponsibility,
)


@admin.register(JobCategory)
class JobCategoryAdmin(ModelAdmin):
    list_display = (
        "name",
        "display_order",
        "is_active",
    )
    list_editable = (
        "display_order",
        "is_active",
    )
    list_filter = (
        "is_active",
    )
    search_fields = (
        "name",
        "slug",
    )
    ordering = (
        "display_order",
        "name",
    )
    readonly_fields = (
        "slug",
    )
    fields = (
        "name",
        "slug",
        "display_order",
        "is_active",
    )


class OrderedJobItemInline(TabularInline):
    fields = (
        "text",
        "display_order",
    )
    extra = 1
    ordering = (
        "display_order",
        "pk",
    )


class JobResponsibilityInline(OrderedJobItemInline):
    model = JobResponsibility


class JobRequirementInline(OrderedJobItemInline):
    model = JobRequirement


class JobNiceToHaveInline(OrderedJobItemInline):
    model = JobNiceToHave


@admin.register(JobPosting)
class JobPostingAdmin(ModelAdmin):
    list_display = (
        "title",
        "category",
        "employment_type",
        "location",
        "is_urgent",
        "status",
        "display_order",
        "posted_at",
    )
    list_editable = (
        "is_urgent",
        "status",
        "display_order",
    )
    list_filter = (
        "status",
        "category",
        "employment_type",
        "seniority",
        "is_urgent",
        "posted_at",
    )
    search_fields = (
        "title",
        "slug",
        "location",
        "description",
        "category__name",
    )
    autocomplete_fields = (
        "category",
    )
    list_select_related = (
        "category",
    )
    ordering = (
        "display_order",
        "-posted_at",
        "title",
        "pk",
    )
    readonly_fields = (
        "slug",
    )
    date_hierarchy = "posted_at"
    save_on_top = True
    inlines = (
        JobResponsibilityInline,
        JobRequirementInline,
        JobNiceToHaveInline,
    )

    fieldsets = (
        (
            "Role",
            {
                "fields": (
                    "title",
                    "slug",
                    "category",
                    "location",
                    "seniority",
                    "employment_type",
                    "is_urgent",
                ),
            },
        ),
        (
            "Compensation",
            {
                "fields": (
                    "pay_min",
                    "pay_max",
                    "pay_unit",
                ),
            },
        ),
        (
            "Description",
            {
                "fields": (
                    "description",
                ),
            },
        ),
        (
            "Publishing",
            {
                "fields": (
                    "status",
                    "posted_at",
                    "display_order",
                ),
            },
        ),
    )