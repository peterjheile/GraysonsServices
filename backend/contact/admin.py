from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import ContactSubmission


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