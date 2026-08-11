from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline

from .models import (
    ContactSubmission,
    JobApplication,
    QuoteRequest,
    QuoteRequestPhoto,
)


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(ModelAdmin):
    list_display = (
        "full_name",
        "email",
        "phone",
        "subject",
        "created_at",
    )
    search_fields = (
        "first_name",
        "last_name",
        "email",
        "phone",
        "subject",
        "message",
    )
    list_filter = (
        "created_at",
    )
    readonly_fields = (
        "first_name",
        "last_name",
        "email",
        "phone",
        "subject",
        "message",
        "created_at",
    )
    ordering = (
        "-created_at",
    )
    date_hierarchy = "created_at"

    fieldsets = (
        (
            "Contact Information",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                    "phone",
                ),
            },
        ),
        (
            "Message",
            {
                "fields": (
                    "subject",
                    "message",
                ),
            },
        ),
        (
            "Submission Information",
            {
                "fields": (
                    "created_at",
                ),
            },
        ),
    )

    @admin.display(description="Name", ordering="last_name")
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def has_add_permission(self, request):
        return False


class QuoteRequestPhotoInline(TabularInline):
    model = QuoteRequestPhoto
    fields = (
        "photo_link",
        "created_at",
    )
    readonly_fields = (
        "photo_link",
        "created_at",
    )
    extra = 0
    can_delete = False

    @admin.display(description="Photo")
    def photo_link(self, obj):
        if not obj.image:
            return "—"

        filename = obj.image.name.rsplit("/", 1)[-1]
        download_url = reverse(
            "contact:quote-request-photo-download",
            args=(obj.pk,),
        )

        return format_html(
            '<a href="{}" target="_blank" rel="noopener noreferrer">{}</a>',
            download_url,
            filename,
        )

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(QuoteRequest)
class QuoteRequestAdmin(ModelAdmin):
    list_display = (
        "full_name",
        "service_requested",
        "email",
        "phone",
        "city",
        "created_at",
    )
    search_fields = (
        "first_name",
        "last_name",
        "email",
        "phone",
        "address",
        "city",
        "service_type",
        "description",
    )
    list_filter = (
        "project_size",
        "budget",
        "timeline",
        "heard_about",
        "consent",
        "created_at",
    )
    readonly_fields = (
        "first_name",
        "last_name",
        "email",
        "phone",
        "address",
        "city",
        "service_type",
        "project_size",
        "budget",
        "timeline",
        "description",
        "heard_about",
        "consent",
        "created_at",
    )
    ordering = (
        "-created_at",
    )
    date_hierarchy = "created_at"
    inlines = (
        QuoteRequestPhotoInline,
    )

    fieldsets = (
        (
            "Contact Information",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                    "phone",
                    "address",
                    "city",
                ),
            },
        ),
        (
            "Project Details",
            {
                "fields": (
                    "service_type",
                    "project_size",
                    "budget",
                    "timeline",
                    "description",
                ),
            },
        ),
        (
            "Additional Information",
            {
                "fields": (
                    "heard_about",
                ),
            },
        ),
        (
            "Submission Information",
            {
                "fields": (
                    "consent",
                    "created_at",
                ),
            },
        ),
    )

    @admin.display(description="Name", ordering="last_name")
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    @admin.display(description="Service", ordering="service_type")
    def service_requested(self, obj):
        return obj.service_type.replace("-", " ").title()

    def has_add_permission(self, request):
        return False


@admin.register(JobApplication)
class JobApplicationAdmin(ModelAdmin):
    list_display = (
        "full_name",
        "job_role",
        "email",
        "city",
        "resume_available",
        "status",
        "created_at",
    )
    list_editable = (
        "status",
    )
    list_filter = (
        "status",
        "job_posting",
        "years_experience",
        "availability",
        "pay_range_response",
        "consent",
        "created_at",
    )
    search_fields = (
        "first_name",
        "last_name",
        "email",
        "phone",
        "city",
        "motivation",
        "job_posting__title",
    )
    readonly_fields = (
        "job_posting",
        "first_name",
        "last_name",
        "email",
        "phone",
        "city",
        "years_experience",
        "availability",
        "pay_range_response",
        "motivation",
        "resume_download_link",
        "consent",
        "created_at",
        "updated_at",
    )
    list_select_related = (
        "job_posting",
        "job_posting__category",
    )
    ordering = (
        "-created_at",
    )
    date_hierarchy = "created_at"

    fieldsets = (
        (
            "Application",
            {
                "fields": (
                    "job_posting",
                    "status",
                    "created_at",
                    "updated_at",
                ),
            },
        ),
        (
            "Applicant",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                    "phone",
                    "city",
                ),
            },
        ),
        (
            "Role Questions",
            {
                "fields": (
                    "years_experience",
                    "availability",
                    "pay_range_response",
                    "motivation",
                ),
            },
        ),
        (
            "Documents and Consent",
            {
                "fields": (
                    "resume_download_link",
                    "consent",
                ),
            },
        ),
        (
            "Internal Review",
            {
                "fields": (
                    "internal_notes",
                ),
            },
        ),
    )

    @admin.display(description="Name", ordering="last_name")
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    @admin.display(description="Role", ordering="job_posting__title")
    def job_role(self, obj):
        return obj.job_posting.title

    @admin.display(description="Résumé", boolean=True)
    def resume_available(self, obj):
        return bool(obj.resume and obj.resume.name)

    @admin.display(description="Résumé")
    def resume_download_link(self, obj):
        if not obj.pk or not obj.resume or not obj.resume.name:
            return "No résumé uploaded"

        filename = obj.resume.name.rsplit("/", 1)[-1]
        download_url = reverse(
            "contact:job-application-resume-download",
            args=(obj.pk,),
        )

        return format_html(
            '<a href="{}" target="_blank" rel="noopener noreferrer">'
            "Download {}</a>",
            download_url,
            filename,
        )

    def has_add_permission(self, request):
        return False
