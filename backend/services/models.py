from django.db import models
from django.utils.text import slugify


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
            self.slug = slugify(self.name)

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
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)


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