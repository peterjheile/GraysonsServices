from rest_framework import serializers

from .models import ContactSubmission


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = (
            "first_name",
            "last_name",
            "email",
            "phone",
            "subject",
            "message",
            "created_at",
        )
        read_only_fields = (
            "created_at",
        )
        extra_kwargs = {
            "first_name": {
                "required": True,
                "allow_blank": False,
            },
            "last_name": {
                "required": True,
                "allow_blank": False,
            },
            "email": {
                "required": True,
                "allow_blank": False,
            },
            "phone": {
                "required": False,
                "allow_blank": True,
            },
            "subject": {
                "required": True,
                "allow_blank": False,
            },
            "message": {
                "required": True,
                "allow_blank": False,
            },
        }