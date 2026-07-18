from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline

from .models import BusinessHours, CompanyStats, SiteSettings


class BusinessHoursInline(TabularInline):
    model = BusinessHours
    extra = 0
    fields = (
        "day",
        "opening_time",
        "closing_time",
        "is_closed",
    )


@admin.register(SiteSettings)
class SiteSettingsAdmin(ModelAdmin):
    inlines = (
        BusinessHoursInline,
    )

    fieldsets = (
        (
            "Business Information",
            {
                "fields": (
                    "business_name",
                    "tagline",
                    "logo",
                    "optimized_logo_preview",
                    "favicon",
                    "optimized_favicon_preview",
                ),
            },
        ),
        (
            "Contact Information",
            {
                "fields": (
                    "phone",
                    "email",
                    "address_line_1",
                    "address_line_2",
                    "city",
                    "state",
                    "zip_code",
                    "service_area",
                ),
            },
        ),
        (
            "Social Links",
            {
                "fields": (
                    "facebook_url",
                    "instagram_url",
                    "google_business_url",
                    "linkedin_url",
                ),
            },
        ),
        (
            "Default SEO",
            {
                "description": (
                    "SEO changes appear on the website immediately, but search "
                    "engines, browsers, and social platforms may cache old "
                    "information. Updated titles, descriptions, favicons, and "
                    "social images may take several days or weeks to appear "
                    "everywhere."
                ),
                "fields": (
                    "seo_title",
                    "seo_description",
                    "social_image",
                    "optimized_social_image_preview",
                ),
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "updated_at",
                ),
                "classes": ("collapse",),
            },
        ),
    )

    readonly_fields = (
        "optimized_logo_preview",
        "optimized_favicon_preview",
        "optimized_social_image_preview",
        "updated_at",
    )

    @admin.display(description="Website logo preview")
    def optimized_logo_preview(self, obj):
        if not obj or not obj.optimized_logo:
            return "Save the settings to generate the optimized logo."

        return format_html(
            '<img src="{}" alt="Optimized logo" '
            'style="display: block; width: auto; height: auto; '
            'max-width: 300px; max-height: 100px; '
            'object-fit: contain;" />',
            obj.optimized_logo.url,
        )

    @admin.display(description="Website favicon preview")
    def optimized_favicon_preview(self, obj):
        if not obj or not obj.optimized_favicon:
            return "Save the settings to generate the optimized favicon."

        return format_html(
            '<img src="{}" alt="Optimized favicon" '
            'style="display: block; width: 96px; height: 96px; '
            'object-fit: contain;" />',
            obj.optimized_favicon.url,
        )
    
    @admin.display(description="Website social image preview")
    def optimized_social_image_preview(self, obj):
        if not obj or not obj.optimized_social_image:
            return (
                "Save the settings to generate the optimized "
                "social image."
            )

        return format_html(
            '<img src="{}" alt="Optimized social image" '
            'style="display: block; width: 100%; height: auto; '
            'max-width: 600px; aspect-ratio: 1200 / 630; '
            'object-fit: contain;" />',
            obj.optimized_social_image.url,
        )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
    




@admin.register(CompanyStats)
class CompanyStatsAdmin(ModelAdmin):
    fieldsets = (
        (
            "Company Statistics",
            {
                "fields": (
                    "years_in_business",
                    "projects_completed",
                    "client_satisfaction",
                ),
                "description": (
                    "These statistics may be displayed throughout the website. "
                    "Enter numbers only; symbols such as + and % are added by "
                    "the frontend."
                ),
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "updated_at",
                ),
            },
        ),
    )

    readonly_fields = (
        "updated_at",
    )

    list_display = (
        "__str__",
        "years_in_business",
        "projects_completed",
        "client_satisfaction",
        "updated_at",
    )

    def has_add_permission(self, request):
        return not CompanyStats.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False