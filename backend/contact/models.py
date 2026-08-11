import logging

from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator, MinLengthValidator
from django.db import models, transaction
from django.db.models import Q
from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from .storage import private_media_storage
from .validators import (
    validate_consent_is_accepted,
    validate_quote_photo,
    validate_resume_contents,
    validate_resume_size,
)


logger = logging.getLogger(__name__)

MAX_QUOTE_REQUEST_PHOTOS = 5
SPECIAL_SERVICE_TYPES = frozenset({"multiple-services", "not-sure"})


def _delete_private_file_after_commit(*, storage, name, using, description):
    if not name:
        return

    def delete_file():
        try:
            storage.delete(name)
        except Exception:
            logger.exception("Failed to delete private %s %s", description, name)

    transaction.on_commit(delete_file, using=using)


def _validate_for_save(instance, update_fields):
    """Run model validation without validating intentionally unsaved fields."""

    if update_fields is None:
        instance.full_clean()
        return

    update_fields = set(update_fields)
    included_names = {
        field.name
        for field in instance._meta.concrete_fields
        if field.name in update_fields or field.attname in update_fields
    }
    excluded_names = {
        field.name
        for field in instance._meta.concrete_fields
        if field.name not in included_names
    }
    instance.full_clean(exclude=excluded_names)


def _field_changed(instance, field_name):
    if not instance.pk:
        return True

    field = instance._meta.get_field(field_name)
    current_value = getattr(instance, field.attname)
    previous_value = (
        type(instance)._base_manager.filter(pk=instance.pk)
        .values_list(field.attname, flat=True)
        .first()
    )
    return previous_value != current_value


def _delete_failed_upload(field_file, *, description):
    if not field_file or not field_file.name:
        return

    if not getattr(field_file, "_committed", False):
        return

    try:
        field_file.storage.delete(field_file.name)
    except Exception:
        logger.exception(
            "Failed to clean up private %s %s after save failure",
            description,
            field_file.name,
        )


class ValidatedSaveModel(models.Model):
    """Validate normal model saves, including direct service/script writes."""

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        _validate_for_save(self, kwargs.get("update_fields"))
        return super().save(*args, **kwargs)


class ContactSubmission(ValidatedSaveModel):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField(max_length=5000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at", "-pk")
        verbose_name = "Contact Submission"
        verbose_name_plural = "Contact Submissions"

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.subject}"


class QuoteRequest(ValidatedSaveModel):
    class ProjectSize(models.TextChoices):
        NOT_SURE = "not-sure", "Not sure"
        SMALL = "small", "Small — under 500 sq ft"
        MEDIUM = "medium", "Medium — 500–1,500 sq ft"
        LARGE = "large", "Large — 1,500–3,000 sq ft"
        EXTRA_LARGE = "xl", "XL / Commercial — 3,000+ sq ft"

    class Budget(models.TextChoices):
        NOT_SURE = "Not sure", "Not sure"
        UNDER_5K = "<$5k", "Under $5,000"
        FROM_5K_TO_15K = "$5–15k", "$5,000–$15,000"
        FROM_15K_TO_30K = "$15–30k", "$15,000–$30,000"
        FROM_30K_TO_60K = "$30–60k", "$30,000–$60,000"
        OVER_60K = "$60k+", "$60,000+"

    class Timeline(models.TextChoices):
        ASAP = "ASAP", "ASAP"
        WITHIN_ONE_MONTH = "Within 1 month", "Within 1 month"
        ONE_TO_THREE_MONTHS = "1–3 months", "1–3 months"
        THREE_TO_SIX_MONTHS = "3–6 months", "3–6 months"
        THIS_YEAR = "This year", "This year"
        JUST_PLANNING = "Just planning", "Just planning"
        NOT_SURE = "Not sure yet", "Not sure yet"

    class ReferralSource(models.TextChoices):
        GOOGLE = "Google Search", "Google Search"
        HOUZZ = "Houzz", "Houzz"
        WORD_OF_MOUTH = (
            "Neighbour / Word of Mouth",
            "Neighbour / Word of Mouth",
        )
        SOCIAL_MEDIA = "Facebook / Instagram", "Facebook / Instagram"
        YARD_SIGN = "Saw our yard sign", "Saw our yard sign"
        RETURNING_CUSTOMER = "Returning customer", "Returning customer"
        NOT_SURE = "Not sure / don't remember", "Not sure / don't remember"
        OTHER = "Other", "Other"

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    service_type = models.CharField(
        max_length=150,
        help_text=(
            "The submitted active service slug, 'multiple-services', or "
            "'not-sure'. The stored value remains a historical snapshot."
        ),
    )
    project_size = models.CharField(
        max_length=20,
        choices=ProjectSize.choices,
        default=ProjectSize.NOT_SURE,
    )
    budget = models.CharField(
        max_length=20,
        choices=Budget.choices,
        default=Budget.NOT_SURE,
    )
    timeline = models.CharField(
        max_length=30,
        choices=Timeline.choices,
        blank=True,
    )
    description = models.TextField(max_length=5000, blank=True)
    heard_about = models.CharField(
        max_length=50,
        choices=ReferralSource.choices,
        blank=True,
    )
    consent = models.BooleanField(
        default=False,
        help_text="Whether the customer agreed to be contacted.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at", "-pk")
        verbose_name = "Quote Request"
        verbose_name_plural = "Quote Requests"
        constraints = (
            models.CheckConstraint(
                condition=Q(consent=True),
                name="contact_quote_request_requires_consent",
            ),
        )

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.service_type}"

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude=exclude)
        excluded = set(exclude or ())

        if "service_type" in excluded or not _field_changed(self, "service_type"):
            return

        if self.service_type in SPECIAL_SERVICE_TYPES:
            return

        from services.models import Service

        if not Service.objects.filter(
            slug=self.service_type,
            is_active=True,
        ).exists():
            raise ValidationError(
                {
                    "service_type": (
                        "Select an active service, multiple services, or not sure."
                    )
                }
            )


class QuoteRequestPhoto(ValidatedSaveModel):
    quote_request = models.ForeignKey(
        QuoteRequest,
        on_delete=models.CASCADE,
        related_name="photos",
    )
    image = models.FileField(
        upload_to="quote-requests/%Y/%m/",
        storage=private_media_storage,
        validators=(validate_quote_photo,),
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("created_at", "pk")
        verbose_name = "Quote Request Photo"
        verbose_name_plural = "Quote Request Photos"

    def __str__(self):
        return f"{self.quote_request} — Photo {self.pk}"

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude=exclude)
        excluded = set(exclude or ())

        if "quote_request" in excluded or self.pk or not self.quote_request_id:
            return

        if self.quote_request.photos.count() >= MAX_QUOTE_REQUEST_PHOTOS:
            raise ValidationError(
                {"quote_request": "A quote request may contain up to 5 photos."}
            )

    def save(self, *args, **kwargs):
        update_fields = kwargs.get("update_fields")
        image_is_saved = update_fields is None or "image" in set(update_fields)
        new_upload = (
            self.image
            if image_is_saved
            and self.image
            and not getattr(self.image, "_committed", False)
            else None
        )

        try:
            return super().save(*args, **kwargs)
        except Exception:
            _delete_failed_upload(
                new_upload,
                description="quote-request photo",
            )
            raise


class JobApplication(ValidatedSaveModel):
    class YearsOfExperience(models.TextChoices):
        UNDER_ONE = "under-1", "Less than 1 year"
        ONE_TO_THREE = "1-3", "1–3 years"
        FOUR_TO_SIX = "4-6", "4–6 years"
        SEVEN_TO_TEN = "7-10", "7–10 years"
        OVER_TEN = "10-plus", "10+ years"

    class Availability(models.TextChoices):
        IMMEDIATELY = "immediately", "Immediately"
        WITHIN_ONE_WEEK = "within-1-week", "Within 1 week"
        WITHIN_TWO_WEEKS = "within-2-weeks", "Within 2 weeks"
        WITHIN_ONE_MONTH = "within-1-month", "Within 1 month"
        OVER_ONE_MONTH = "over-1-month", "More than 1 month"
        FLEXIBLE = "flexible", "Flexible"

    class PayRangeResponse(models.TextChoices):
        ACCEPT = "accept", "Yes, this works for me"
        DISCUSS = "discuss", "I'd like to discuss"

    class Status(models.TextChoices):
        NEW = "new", "New"
        REVIEWING = "reviewing", "Reviewing"
        INTERVIEW = "interview", "Interview"
        OFFER = "offer", "Offer"
        HIRED = "hired", "Hired"
        NOT_SELECTED = "not-selected", "Not Selected"
        WITHDRAWN = "withdrawn", "Withdrawn"

    job_posting = models.ForeignKey(
        "careers.JobPosting",
        on_delete=models.PROTECT,
        related_name="applications",
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    city = models.CharField(max_length=100, blank=True)
    years_experience = models.CharField(
        max_length=20,
        choices=YearsOfExperience.choices,
    )
    availability = models.CharField(max_length=30, choices=Availability.choices)
    pay_range_response = models.CharField(
        max_length=20,
        choices=PayRangeResponse.choices,
    )
    motivation = models.TextField(
        max_length=5000,
        validators=(MinLengthValidator(20),),
        verbose_name="Why do you want to work at Grayson's?",
    )
    resume = models.FileField(
        upload_to="job-applications/resumes/%Y/%m/",
        storage=private_media_storage,
        blank=True,
        validators=(
            FileExtensionValidator(allowed_extensions=("pdf", "doc", "docx")),
            validate_resume_size,
            validate_resume_contents,
        ),
    )
    consent = models.BooleanField(
        default=False,
        validators=(validate_consent_is_accepted,),
        help_text=(
            "The applicant agreed that Grayson's Services may review their "
            "information for this and future openings."
        ),
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
    )
    internal_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at", "-pk")
        verbose_name = "Job Application"
        verbose_name_plural = "Job Applications"
        indexes = (models.Index(fields=("job_posting", "status")),)
        constraints = (
            models.CheckConstraint(
                condition=Q(consent=True),
                name="contact_job_application_requires_consent",
            ),
        )

    def __str__(self):
        return (
            f"{self.first_name} {self.last_name} — {self.job_posting.title}"
        )

    def clean_fields(self, exclude=None):
        super().clean_fields(exclude=exclude)
        excluded = set(exclude or ())

        if "job_posting" in excluded or not _field_changed(self, "job_posting"):
            return

        from careers.models import JobPosting

        if not JobPosting.objects.filter(
            pk=self.job_posting_id,
            status=JobPosting.Status.OPEN,
            category__is_active=True,
        ).exists():
            raise ValidationError(
                {
                    "job_posting": (
                        "This job is no longer accepting applications."
                    )
                }
            )

    def save(self, *args, **kwargs):
        update_fields = kwargs.get("update_fields")
        resume_is_saved = update_fields is None or "resume" in set(update_fields)
        new_upload = (
            self.resume
            if resume_is_saved
            and self.resume
            and not getattr(self.resume, "_committed", False)
            else None
        )

        try:
            return super().save(*args, **kwargs)
        except Exception:
            _delete_failed_upload(
                new_upload,
                description="job-application resume",
            )
            raise


def _remember_replaced_file(
    *, sender, instance, using, raw, update_fields, field_name, attribute_name
):
    setattr(instance, attribute_name, None)

    if raw or not instance.pk:
        return

    if update_fields is not None and field_name not in set(update_fields):
        return

    try:
        previous = (
            sender._base_manager.using(using)
            .only(field_name)
            .get(pk=instance.pk)
        )
    except sender.DoesNotExist:
        return

    previous_file = getattr(previous, field_name)
    current_file = getattr(instance, field_name)
    previous_name = previous_file.name if previous_file else ""
    current_name = current_file.name if current_file else ""

    if previous_name and previous_name != current_name:
        setattr(instance, attribute_name, previous_name)


def _delete_remembered_file(
    *, sender, instance, using, raw, field_name, attribute_name, description
):
    if raw:
        return

    old_name = getattr(instance, attribute_name, None)

    if old_name:
        _delete_private_file_after_commit(
            storage=sender._meta.get_field(field_name).storage,
            name=old_name,
            using=using,
            description=description,
        )


@receiver(
    pre_save,
    sender=QuoteRequestPhoto,
    dispatch_uid="contact.remember_replaced_quote_request_photo",
)
def remember_replaced_quote_request_photo(
    sender, instance, using, raw, update_fields, **kwargs
):
    _remember_replaced_file(
        sender=sender,
        instance=instance,
        using=using,
        raw=raw,
        update_fields=update_fields,
        field_name="image",
        attribute_name="_image_name_to_delete",
    )


@receiver(
    post_save,
    sender=QuoteRequestPhoto,
    dispatch_uid="contact.delete_replaced_quote_request_photo",
)
def delete_replaced_quote_request_photo(sender, instance, using, raw, **kwargs):
    _delete_remembered_file(
        sender=sender,
        instance=instance,
        using=using,
        raw=raw,
        field_name="image",
        attribute_name="_image_name_to_delete",
        description="replaced quote-request photo",
    )


@receiver(
    post_delete,
    sender=QuoteRequestPhoto,
    dispatch_uid="contact.delete_quote_request_photo_file",
)
def delete_quote_request_photo_file(sender, instance, using, **kwargs):
    if instance.image and instance.image.name:
        _delete_private_file_after_commit(
            storage=instance.image.storage,
            name=instance.image.name,
            using=using,
            description="quote-request photo",
        )


@receiver(
    pre_save,
    sender=JobApplication,
    dispatch_uid="contact.remember_replaced_job_application_resume",
)
def remember_replaced_job_application_resume(
    sender, instance, using, raw, update_fields, **kwargs
):
    _remember_replaced_file(
        sender=sender,
        instance=instance,
        using=using,
        raw=raw,
        update_fields=update_fields,
        field_name="resume",
        attribute_name="_resume_name_to_delete",
    )


@receiver(
    post_save,
    sender=JobApplication,
    dispatch_uid="contact.delete_replaced_job_application_resume",
)
def delete_replaced_job_application_resume(sender, instance, using, raw, **kwargs):
    _delete_remembered_file(
        sender=sender,
        instance=instance,
        using=using,
        raw=raw,
        field_name="resume",
        attribute_name="_resume_name_to_delete",
        description="replaced job-application resume",
    )


@receiver(
    post_delete,
    sender=JobApplication,
    dispatch_uid="contact.delete_job_application_resume",
)
def delete_job_application_resume(sender, instance, using, **kwargs):
    if instance.resume and instance.resume.name:
        _delete_private_file_after_commit(
            storage=instance.resume.storage,
            name=instance.resume.name,
            using=using,
            description="job-application resume",
        )
