import logging

from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import serializers

from careers.models import JobPosting

from .models import (
    SPECIAL_SERVICE_TYPES,
    ContactSubmission,
    JobApplication,
    QuoteRequest,
    QuoteRequestPhoto,
)
from .validators import validate_quote_photo


logger = logging.getLogger(__name__)


def _as_serializer_error(exc):
    if hasattr(exc, "message_dict"):
        return serializers.ValidationError(exc.message_dict)

    return serializers.ValidationError(exc.messages)


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
        read_only_fields = ("created_at",)
        extra_kwargs = {
            "first_name": {"required": True, "allow_blank": False},
            "last_name": {"required": True, "allow_blank": False},
            "email": {"required": True, "allow_blank": False},
            "phone": {"required": False, "allow_blank": True},
            "subject": {
                "required": True,
                "allow_blank": False,
                "max_length": 200,
            },
            "message": {
                "required": True,
                "allow_blank": False,
                "max_length": 5000,
            },
        }


class MultipleFileField(serializers.ListField):
    child = serializers.FileField(allow_empty_file=False)

    def get_value(self, dictionary):
        if hasattr(dictionary, "getlist"):
            files = dictionary.getlist(self.field_name)

            if files:
                return files

        return super().get_value(dictionary)


class QuoteRequestSerializer(serializers.ModelSerializer):
    photos = MultipleFileField(
        required=False,
        write_only=True,
        max_length=5,
    )

    class Meta:
        model = QuoteRequest
        fields = (
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
            "photos",
            "created_at",
        )
        read_only_fields = ("created_at",)
        extra_kwargs = {
            "first_name": {"required": True, "allow_blank": False},
            "last_name": {"required": True, "allow_blank": False},
            "email": {"required": True, "allow_blank": False},
            "phone": {"required": True, "allow_blank": False},
            "address": {"required": False, "allow_blank": True},
            "city": {"required": False, "allow_blank": True},
            "service_type": {"required": True, "allow_blank": False},
            "project_size": {"required": False},
            "budget": {"required": False},
            "timeline": {"required": False, "allow_blank": True},
            "description": {
                "required": False,
                "allow_blank": True,
                "max_length": 5000,
            },
            "heard_about": {"required": False, "allow_blank": True},
            "consent": {"required": True},
        }

    def validate_consent(self, value):
        if not value:
            raise serializers.ValidationError(
                "You must agree to be contacted before submitting."
            )

        return value

    def validate_service_type(self, value):
        if value in SPECIAL_SERVICE_TYPES:
            return value

        from services.models import Service

        if not Service.objects.filter(slug=value, is_active=True).exists():
            raise serializers.ValidationError(
                "Select an active service, multiple services, or not sure."
            )

        return value

    def validate_photos(self, photos):
        for photo in photos:
            try:
                validate_quote_photo(photo)
            except DjangoValidationError as exc:
                raise _as_serializer_error(exc) from exc

        return photos

    def create(self, validated_data):
        photos = validated_data.pop("photos", [])
        saved_files = []

        try:
            with transaction.atomic():
                try:
                    quote_request = QuoteRequest.objects.create(**validated_data)
                except DjangoValidationError as exc:
                    raise _as_serializer_error(exc) from exc

                for photo in photos:
                    photo_record = QuoteRequestPhoto(
                        quote_request=quote_request,
                        image=photo,
                    )

                    try:
                        photo_record.save()
                    except DjangoValidationError as exc:
                        raise _as_serializer_error(exc) from exc

                    saved_files.append(
                        (photo_record.image.storage, photo_record.image.name)
                    )
        except Exception:
            for storage, name in saved_files:
                try:
                    storage.delete(name)
                except Exception:
                    logger.exception(
                        "Failed to clean up private quote-request photo %s "
                        "after request creation failed",
                        name,
                    )

            raise

        return quote_request


class JobApplicationSerializer(serializers.ModelSerializer):
    job_posting = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=JobPosting.objects.filter(
            status=JobPosting.Status.OPEN,
            category__is_active=True,
        ),
        error_messages={
            "does_not_exist": "This job is no longer accepting applications.",
            "invalid": "Select a valid job posting.",
        },
    )

    class Meta:
        model = JobApplication
        fields = (
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
            "resume",
            "consent",
            "created_at",
        )
        read_only_fields = ("created_at",)
        extra_kwargs = {
            "first_name": {"required": True, "allow_blank": False},
            "last_name": {"required": True, "allow_blank": False},
            "email": {"required": True, "allow_blank": False},
            "phone": {"required": True, "allow_blank": False},
            "city": {"required": False, "allow_blank": True},
            "years_experience": {"required": True},
            "availability": {"required": True},
            "pay_range_response": {"required": True},
            "motivation": {
                "required": True,
                "allow_blank": False,
                "min_length": 20,
                "max_length": 5000,
            },
            "resume": {
                "required": False,
                "allow_empty_file": False,
                "write_only": True,
            },
            "consent": {"required": True},
        }

    def validate_consent(self, value):
        if not value:
            raise serializers.ValidationError(
                "You must agree before submitting an application."
            )

        return value

    def create(self, validated_data):
        selected_posting = validated_data["job_posting"]
        application = JobApplication(**validated_data)

        try:
            with transaction.atomic():
                current_posting = (
                    JobPosting.objects.select_for_update()
                    .filter(
                        pk=selected_posting.pk,
                        status=JobPosting.Status.OPEN,
                        category__is_active=True,
                    )
                    .first()
                )

                if current_posting is None:
                    raise serializers.ValidationError(
                        {
                            "job_posting": (
                                "This job is no longer accepting applications."
                            )
                        }
                    )

                application.job_posting = current_posting

                try:
                    application.save()
                except DjangoValidationError as exc:
                    raise _as_serializer_error(exc) from exc
        except Exception:
            resume = application.resume

            if resume and resume.name and getattr(resume, "_committed", False):
                try:
                    resume.storage.delete(resume.name)
                except Exception:
                    logger.exception(
                        "Failed to clean up private resume %s after job "
                        "application creation failed",
                        resume.name,
                    )

            raise

        return application
