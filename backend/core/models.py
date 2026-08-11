import logging

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models, transaction
from django.db.models import F, Q
from django.db.models.signals import post_delete
from django.dispatch import receiver

from .utils.image_processing import (
    create_optimized_favicon,
    create_optimized_logo,
    create_optimized_social_image,
)
from .validators import (
    validate_favicon,
    validate_logo,
    validate_social_image,
)


logger = logging.getLogger(__name__)

SITE_IMAGE_PAIRS = (
    ("logo", "optimized_logo", create_optimized_logo),
    ("favicon", "optimized_favicon", create_optimized_favicon),
    (
        "social_image",
        "optimized_social_image",
        create_optimized_social_image,
    ),
)
SITE_IMAGE_FIELDS = tuple(
    field_name
    for original_name, optimized_name, _processor in SITE_IMAGE_PAIRS
    for field_name in (original_name, optimized_name)
)


def _delete_stored_files(files):
    """Delete storage files without masking a committed database change."""
    for storage, name in files:
        if not name:
            continue
        try:
            storage.delete(name)
        except Exception:
            logger.exception("Could not delete Core image %s", name)


class SingletonQuerySet(models.QuerySet):
    def update(self, **kwargs):
        if set(kwargs).intersection(SITE_IMAGE_FIELDS):
            raise ValidationError(
                "Use SiteSettings.save() for image changes so optimized "
                "images and file cleanup stay synchronized."
            )
        return super().update(**kwargs)

    def bulk_create(self, objs, **kwargs):
        raise ValidationError(
            "Singleton records must be saved individually."
        )

    def bulk_update(self, objs, fields, **kwargs):
        if set(fields).intersection(SITE_IMAGE_FIELDS):
            raise ValidationError(
                "Use SiteSettings.save() for image changes so optimized "
                "images and file cleanup stay synchronized."
            )
        return super().bulk_update(objs, fields, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError(
            "This singleton record cannot be deleted. Edit it instead."
        )


class SingletonManager(models.Manager.from_queryset(SingletonQuerySet)):
    pass


class SiteSettings(models.Model):
    singleton_key = models.PositiveSmallIntegerField(
        default=1,
        editable=False,
        unique=True,
    )

    # Business information
    business_name = models.CharField(
        max_length=150,
        default="Grayson's Services",
    )
    tagline = models.CharField(max_length=255, blank=True)
    logo = models.ImageField(
        upload_to="site/branding/originals/",
        blank=True,
        null=True,
        validators=(validate_logo,),
        help_text=(
            "Upload a PNG, JPEG, or WebP logo no larger than 2 MB. "
            "Horizontal, square, and vertical logos are supported. "
            "An optimized website copy will be created automatically."
        ),
    )
    optimized_logo = models.ImageField(
        upload_to="site/branding/optimized/",
        blank=True,
        null=True,
        editable=False,
    )
    favicon = models.ImageField(
        upload_to="site/favicon/originals/",
        blank=True,
        null=True,
        validators=(validate_favicon,),
        help_text=(
            "Upload a square PNG, JPEG, or WebP image between "
            "192 × 192 and 2048 × 2048 pixels. A 192 × 192 PNG "
            "favicon will be created automatically."
        ),
    )
    optimized_favicon = models.ImageField(
        upload_to="site/favicon/optimized/",
        blank=True,
        null=True,
        editable=False,
    )

    # Contact information
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    address_line_1 = models.CharField(max_length=255, blank=True)
    address_line_2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    service_area = models.CharField(
        max_length=255,
        blank=True,
        help_text="Example: Bloomington and surrounding communities.",
    )

    # Social links
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    google_business_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    # Default SEO
    seo_title = models.CharField(
        max_length=70,
        blank=True,
        help_text="Used as the default page title.",
    )
    seo_description = models.CharField(
        max_length=170,
        blank=True,
        help_text="Used as the default search description.",
    )
    social_image = models.ImageField(
        upload_to="site/seo/originals/",
        blank=True,
        null=True,
        validators=(validate_social_image,),
        help_text=(
            "Upload a PNG, JPEG, or WebP image at least 1200 × 630 "
            "pixels and no larger than 5 MB. It will be cropped and "
            "optimized to exactly 1200 × 630 pixels."
        ),
    )
    optimized_social_image = models.ImageField(
        upload_to="site/seo/optimized/",
        blank=True,
        null=True,
        editable=False,
    )
    updated_at = models.DateTimeField(auto_now=True)

    objects = SingletonManager()

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"
        constraints = (
            models.CheckConstraint(
                condition=Q(singleton_key=1),
                name="site_settings_singleton_key_is_one",
            ),
        )

    def __str__(self):
        return self.business_name

    def clean(self):
        super().clean()
        if type(self).objects.exclude(pk=self.pk).exists():
            raise ValidationError(
                "Only one Site Settings record may exist."
            )

    def save(self, *args, **kwargs):
        self.singleton_key = 1
        update_fields = kwargs.get("update_fields")
        if update_fields is not None:
            update_fields = set(update_fields)
            kwargs["update_fields"] = update_fields

        editable_fields = {
            field.name
            for field in self._meta.fields
            if field.editable and not field.primary_key
        }
        exclude = None if update_fields is None else editable_fields - update_fields
        self.full_clean(exclude=exclude)

        previous = None
        if self.pk:
            previous = type(self).objects.filter(pk=self.pk).first()

        prepared = []
        optimized_fields_to_save = set()
        new_original_fields = []

        for original_name, optimized_name, processor in SITE_IMAGE_PAIRS:
            original_is_being_saved = (
                update_fields is None or original_name in update_fields
            )
            if not original_is_being_saved:
                continue

            original = getattr(self, original_name)
            optimized = getattr(self, optimized_name)
            previous_original = (
                getattr(previous, original_name) if previous else None
            )
            original_changed = (
                not previous
                or bool(original and not original._committed)
                or (previous_original.name if previous_original else "")
                != (original.name if original else "")
            )

            if original and (original_changed or not optimized):
                prepared.append(
                    (optimized_name, processor(original))
                )
                optimized_fields_to_save.add(optimized_name)
            elif not original and optimized:
                setattr(self, optimized_name, None)
                optimized_fields_to_save.add(optimized_name)

            if original and not original._committed:
                new_original_fields.append(original)

        if update_fields is not None:
            update_fields.update(optimized_fields_to_save)
            kwargs["update_fields"] = update_fields

        old_files = {}
        if previous:
            for field_name in SITE_IMAGE_FIELDS:
                field = getattr(previous, field_name)
                old_files[field_name] = (
                    field.storage,
                    field.name if field else "",
                )

        created_files = []
        try:
            with transaction.atomic():
                super().save(*args, **kwargs)

                for original in new_original_fields:
                    if original.name:
                        created_files.append(
                            (original.storage, original.name)
                        )

                for optimized_name, content in prepared:
                    optimized_field = getattr(self, optimized_name)
                    optimized_field.save(
                        content.name,
                        content,
                        save=False,
                    )
                    created_files.append(
                        (optimized_field.storage, optimized_field.name)
                    )

                if prepared:
                    super().save(
                        update_fields=tuple(
                            optimized_name
                            for optimized_name, _content in prepared
                        )
                    )
        except Exception:
            # A FieldFile may have been committed before model.save() raised.
            for original in new_original_fields:
                if original._committed and original.name:
                    file_entry = (original.storage, original.name)
                    if file_entry not in created_files:
                        created_files.append(file_entry)
            _delete_stored_files(created_files)
            raise

        replaced_files = []
        for field_name, (storage, old_name) in old_files.items():
            current = getattr(self, field_name)
            current_name = current.name if current else ""
            if old_name and old_name != current_name:
                replaced_files.append((storage, old_name))

        if replaced_files:
            transaction.on_commit(
                lambda files=tuple(replaced_files): (
                    _delete_stored_files(files)
                )
            )

    def delete(self, *args, **kwargs):
        raise ValidationError(
            "Site Settings cannot be deleted. Edit the record instead."
        )


class BusinessHours(models.Model):
    class DayOfWeek(models.IntegerChoices):
        MONDAY = 1, "Monday"
        TUESDAY = 2, "Tuesday"
        WEDNESDAY = 3, "Wednesday"
        THURSDAY = 4, "Thursday"
        FRIDAY = 5, "Friday"
        SATURDAY = 6, "Saturday"
        SUNDAY = 7, "Sunday"

    site_settings = models.ForeignKey(
        SiteSettings,
        on_delete=models.CASCADE,
        related_name="business_hours",
    )
    day = models.PositiveSmallIntegerField(choices=DayOfWeek.choices)
    opening_time = models.TimeField(
        blank=True,
        null=True,
        help_text="Example: 8:00 AM or 08:00.",
    )
    closing_time = models.TimeField(
        blank=True,
        null=True,
        help_text="Example: 5:00 PM or 17:00.",
    )
    is_closed = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Business hours"
        verbose_name_plural = "Business hours"
        ordering = ("day",)
        constraints = (
            models.UniqueConstraint(
                fields=("site_settings", "day"),
                name="unique_business_hours_day",
            ),
            models.CheckConstraint(
                condition=(
                    Q(
                        is_closed=True,
                        opening_time__isnull=True,
                        closing_time__isnull=True,
                    )
                    | Q(
                        is_closed=False,
                        opening_time__isnull=False,
                        closing_time__isnull=False,
                        closing_time__gt=F("opening_time"),
                    )
                ),
                name="business_hours_times_match_status",
            ),
        )

    def __str__(self):
        return self.get_day_display()

    def clean(self):
        super().clean()
        errors = {}

        if self.is_closed:
            if self.opening_time is not None:
                errors["opening_time"] = (
                    "A closed day cannot have an opening time."
                )
            if self.closing_time is not None:
                errors["closing_time"] = (
                    "A closed day cannot have a closing time."
                )
        else:
            if self.opening_time is None:
                errors["opening_time"] = (
                    "An open day requires an opening time."
                )
            if self.closing_time is None:
                errors["closing_time"] = (
                    "An open day requires a closing time."
                )
            if (
                self.opening_time is not None
                and self.closing_time is not None
                and self.closing_time <= self.opening_time
            ):
                errors["closing_time"] = (
                    "Closing time must be later than opening time."
                )

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        update_fields = kwargs.get("update_fields")
        editable_fields = {
            field.name
            for field in self._meta.fields
            if field.editable and not field.primary_key
        }
        exclude = (
            None
            if update_fields is None
            else editable_fields - set(update_fields)
        )
        self.full_clean(exclude=exclude)
        super().save(*args, **kwargs)


class CompanyStats(models.Model):
    singleton_key = models.PositiveSmallIntegerField(
        default=1,
        editable=False,
        unique=True,
    )
    years_in_business = models.PositiveIntegerField(default=0)
    projects_completed = models.PositiveIntegerField(default=0)
    client_satisfaction = models.PositiveIntegerField(
        default=100,
        validators=(MinValueValidator(0), MaxValueValidator(100)),
    )
    updated_at = models.DateTimeField(auto_now=True)

    objects = SingletonManager()

    class Meta:
        verbose_name = "Company Statistics"
        verbose_name_plural = "Company Statistics"
        constraints = (
            models.CheckConstraint(
                condition=Q(singleton_key=1),
                name="company_stats_singleton_key_is_one",
            ),
            models.CheckConstraint(
                condition=Q(
                    client_satisfaction__gte=0,
                    client_satisfaction__lte=100,
                ),
                name="client_satisfaction_between_0_and_100",
            ),
        )

    def __str__(self):
        return "Company Statistics"

    def clean(self):
        super().clean()
        if type(self).objects.exclude(pk=self.pk).exists():
            raise ValidationError(
                "Only one Company Statistics record may exist."
            )

    def save(self, *args, **kwargs):
        self.singleton_key = 1
        update_fields = kwargs.get("update_fields")
        editable_fields = {
            field.name
            for field in self._meta.fields
            if field.editable and not field.primary_key
        }
        exclude = (
            None
            if update_fields is None
            else editable_fields - set(update_fields)
        )
        self.full_clean(exclude=exclude)
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError(
            "Company Statistics cannot be deleted. Edit the record instead."
        )


@receiver(
    post_delete,
    sender=SiteSettings,
    dispatch_uid="core.delete_site_settings_images",
)
def delete_site_settings_images(sender, instance, **kwargs):
    """Clean all six files if a row is removed through a low-level path."""
    files = tuple(
        (field.storage, field.name)
        for field_name in SITE_IMAGE_FIELDS
        if (field := getattr(instance, field_name)) and field.name
    )
    if files:
        transaction.on_commit(lambda: _delete_stored_files(files))