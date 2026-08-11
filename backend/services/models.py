import logging

from django.db import models, transaction
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.utils.text import slugify

from .utils.image_processing import (
    PRIMARY_IMAGE_MAX_DIMENSION,
    SUPPORTING_IMAGE_MAX_DIMENSION,
    optimize_service_image,
)


logger = logging.getLogger(__name__)

SERVICE_IMAGE_FIELDS = (
    "primary_image",
    "supporting_image_one",
    "supporting_image_two",
)


def _build_unique_slug(instance, source, *, fallback):
    """Build a nonempty, length-safe slug that is unique for this model."""
    slug_field = instance._meta.get_field("slug")
    max_length = slug_field.max_length

    base_slug = (slugify(source) or fallback)[:max_length].strip("-")
    base_slug = base_slug or fallback[:max_length]

    candidate = base_slug
    suffix_number = 2

    queryset = type(instance).objects.exclude(pk=instance.pk)

    while queryset.filter(slug=candidate).exists():
        suffix = f"-{suffix_number}"
        trimmed_base = base_slug[: max_length - len(suffix)].rstrip("-")
        candidate = f"{trimmed_base}{suffix}"
        suffix_number += 1

    return candidate


def _include_generated_slug(update_fields):
    """Ensure a newly generated slug is persisted during a partial save."""
    if update_fields is None:
        return None

    return set(update_fields) | {"slug"}


def _delete_stored_files(files):
    """Delete storage files without failing an already-committed DB change."""
    for storage, name in files:
        if not name:
            continue

        try:
            storage.delete(name)
        except Exception:
            logger.exception("Could not delete service image %s", name)


class ServiceCategory(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True,
    )

    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = (
            "display_order",
            "name",
        )
        verbose_name = "Service Category"
        verbose_name_plural = "Service Categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _build_unique_slug(
                self,
                self.name,
                fallback="service-category",
            )

            kwargs["update_fields"] = _include_generated_slug(
                kwargs.get("update_fields")
            )

        super().save(*args, **kwargs)


class Service(models.Model):
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.PROTECT,
        related_name="services",
    )

    name = models.CharField(
        max_length=100,
        unique=True,
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
        blank=True,
    )

    subtitle = models.CharField(
        max_length=200,
    )

    overview = models.TextField(
        help_text="The primary description of the service.",
    )

    process_description = models.TextField(
        help_text=(
            "Additional information about the installation process, "
            "materials, guarantees, or customer experience."
        ),
    )

    primary_image = models.ImageField(
        upload_to="services/images/primary/",
    )

    primary_image_alt = models.CharField(
        max_length=200,
        help_text=(
            "Describe the primary image for accessibility and search engines."
        ),
    )

    supporting_image_one = models.ImageField(
        upload_to="services/images/supporting/",
    )

    supporting_image_one_alt = models.CharField(
        max_length=200,
        help_text=(
            "Describe the first supporting image for accessibility "
            "and search engines."
        ),
    )

    supporting_image_two = models.ImageField(
        upload_to="services/images/supporting/",
    )

    supporting_image_two_alt = models.CharField(
        max_length=200,
        help_text=(
            "Describe the second supporting image for accessibility "
            "and search engines."
        ),
    )

    display_order = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(
        default=True,
        help_text="Inactive services are hidden from the public website.",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = (
            "display_order",
            "name",
        )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _build_unique_slug(
                self,
                self.name,
                fallback="service",
            )

            kwargs["update_fields"] = _include_generated_slug(
                kwargs.get("update_fields")
            )

        update_fields = kwargs.get("update_fields")

        image_field_names = tuple(
            field_name
            for field_name in SERVICE_IMAGE_FIELDS
            if update_fields is None or field_name in update_fields
        )

        previous_images = {}

        if self.pk and image_field_names:
            previous = (
                type(self)
                .objects.only(*image_field_names)
                .filter(pk=self.pk)
                .first()
            )

            if previous:
                previous_images = {
                    field_name: getattr(previous, field_name)
                    for field_name in image_field_names
                }

        max_dimensions = {
            "primary_image": PRIMARY_IMAGE_MAX_DIMENSION,
            "supporting_image_one": SUPPORTING_IMAGE_MAX_DIMENSION,
            "supporting_image_two": SUPPORTING_IMAGE_MAX_DIMENSION,
        }

        optimized_images = []

        for field_name in image_field_names:
            image_field = getattr(self, field_name)

            if image_field and not image_field._committed:
                optimized_name, optimized_content = optimize_service_image(
                    image_field,
                    max_dimension=max_dimensions[field_name],
                )

                optimized_images.append(
                    (
                        image_field,
                        optimized_name,
                        optimized_content,
                    )
                )

        created_files = []

        try:
            for (
                image_field,
                optimized_name,
                optimized_content,
            ) in optimized_images:
                image_field.save(
                    optimized_name,
                    optimized_content,
                    save=False,
                )

                created_files.append(
                    (
                        image_field.storage,
                        image_field.name,
                    )
                )

            super().save(*args, **kwargs)

        except Exception:
            _delete_stored_files(created_files)
            raise

        replaced_files = []

        for field_name, previous_image in previous_images.items():
            current_image = getattr(self, field_name)

            if (
                previous_image
                and previous_image.name
                and previous_image.name != current_image.name
            ):
                replaced_files.append(
                    (
                        previous_image.storage,
                        previous_image.name,
                    )
                )

        if replaced_files:
            transaction.on_commit(
                lambda files=tuple(replaced_files): _delete_stored_files(files)
            )


@receiver(
    post_delete,
    sender=Service,
    dispatch_uid="services.delete_service_images",
)
def delete_service_images(sender, instance, **kwargs):
    """Delete all stored images after a Service deletion is committed."""
    files = tuple(
        (
            image.storage,
            image.name,
        )
        for field_name in SERVICE_IMAGE_FIELDS
        if (
            (image := getattr(instance, field_name))
            and image.name
        )
    )

    if files:
        transaction.on_commit(
            lambda: _delete_stored_files(files)
        )


class ServiceIncludedItem(models.Model):
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name="included_items",
    )

    text = models.CharField(
        max_length=200,
    )

    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = (
            "display_order",
            "id",
        )
        verbose_name = "Included Item"
        verbose_name_plural = "Included Items"

    def __str__(self):
        return f"{self.service.name} — {self.text}"