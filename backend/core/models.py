from django.core.exceptions import ValidationError
from django.db import models

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


class SiteSettings(models.Model):
    # Business information
    business_name = models.CharField(
        max_length=150,
        default="Grayson's Services",
    )
    tagline = models.CharField(
        max_length=255,
        blank=True,
    )
    logo = models.ImageField(
        upload_to="site/branding/originals/",
        blank=True,
        null=True,
        validators=[validate_logo],
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
        validators=[validate_favicon],
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
    phone = models.CharField(
        max_length=30,
        blank=True,
    )
    email = models.EmailField(
        blank=True,
    )
    address_line_1 = models.CharField(
        max_length=255,
        blank=True,
    )
    address_line_2 = models.CharField(
        max_length=255,
        blank=True,
    )
    city = models.CharField(
        max_length=100,
        blank=True,
    )
    state = models.CharField(
        max_length=100,
        blank=True,
    )
    zip_code = models.CharField(
        max_length=20,
        blank=True,
    )
    service_area = models.CharField(
        max_length=255,
        blank=True,
        help_text="Example: Bloomington and surrounding communities.",
    )

    # Social links
    facebook_url = models.URLField(
        blank=True,
    )
    instagram_url = models.URLField(
        blank=True,
    )
    google_business_url = models.URLField(
        blank=True,
    )
    linkedin_url = models.URLField(
        blank=True,
    )

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
        validators=[validate_social_image],
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

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self) -> str:
        return self.business_name

    def clean(self) -> None:
        super().clean()

        if type(self).objects.exclude(pk=self.pk).exists():
            raise ValidationError(
                "Only one Site Settings record may exist."
            )

    def save(self, *args, **kwargs) -> None:
        logo_changed = False
        favicon_changed = False
        social_image_changed = False

        if self.pk:
            previous = (
                type(self).objects
                .filter(pk=self.pk)
                .values("logo", "favicon", "social_image")
                .first()
            )

            if previous:
                current_logo = self.logo.name if self.logo else None
                current_favicon = (
                    self.favicon.name if self.favicon else None
                )

                logo_changed = previous["logo"] != current_logo
                favicon_changed = (
                    previous["favicon"] != current_favicon
                )

                current_social_image = (
                    self.social_image.name if self.social_image else None
                )

                social_image_changed = (
                    previous["social_image"] != current_social_image
                )
        else:
            logo_changed = bool(self.logo)
            favicon_changed = bool(self.favicon)
            social_image_changed = bool(self.social_image)

        self.full_clean()
        super().save(*args, **kwargs)

        if self.logo and (
            logo_changed or not self.optimized_logo
        ):
            old_optimized_logo = self.optimized_logo
            optimized_logo = create_optimized_logo(self.logo)

            self.optimized_logo.save(
                optimized_logo.name,
                optimized_logo,
                save=False,
            )

            super().save(
                update_fields=("optimized_logo",),
            )

            if (
                old_optimized_logo
                and old_optimized_logo.name
                != self.optimized_logo.name
            ):
                old_optimized_logo.delete(save=False)

        elif not self.logo and self.optimized_logo:
            old_optimized_logo = self.optimized_logo
            self.optimized_logo = None

            super().save(
                update_fields=("optimized_logo",),
            )

            old_optimized_logo.delete(save=False)

        if self.favicon and (
            favicon_changed or not self.optimized_favicon
        ):
            old_optimized_favicon = self.optimized_favicon
            optimized_favicon = create_optimized_favicon(
                self.favicon
            )

            self.optimized_favicon.save(
                optimized_favicon.name,
                optimized_favicon,
                save=False,
            )

            super().save(
                update_fields=("optimized_favicon",),
            )

            if (
                old_optimized_favicon
                and old_optimized_favicon.name
                != self.optimized_favicon.name
            ):
                old_optimized_favicon.delete(save=False)

        elif not self.favicon and self.optimized_favicon:
            old_optimized_favicon = self.optimized_favicon
            self.optimized_favicon = None

            super().save(
                update_fields=("optimized_favicon",),
            )

            old_optimized_favicon.delete(save=False)

        if self.social_image and (
            social_image_changed or not self.optimized_social_image
        ):
            old_optimized_social_image = self.optimized_social_image

            optimized_social_image = create_optimized_social_image(
                self.social_image
            )

            self.optimized_social_image.save(
                optimized_social_image.name,
                optimized_social_image,
                save=False,
            )

            super().save(
                update_fields=("optimized_social_image",),
            )

            if (
                old_optimized_social_image
                and old_optimized_social_image.name
                != self.optimized_social_image.name
            ):
                old_optimized_social_image.delete(save=False)

        elif not self.social_image and self.optimized_social_image:
            old_optimized_social_image = self.optimized_social_image
            self.optimized_social_image = None

            super().save(
                update_fields=("optimized_social_image",),
            )

            old_optimized_social_image.delete(save=False)



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
    day = models.PositiveSmallIntegerField(
        choices=DayOfWeek.choices,
    )
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
    is_closed = models.BooleanField(
        default=False,
    )

    class Meta:
        verbose_name = "Business hours"
        verbose_name_plural = "Business hours"
        ordering = ("day",)
        constraints = (
            models.UniqueConstraint(
                fields=("site_settings", "day"),
                name="unique_business_hours_day",
            ),
        )

    def __str__(self) -> str:
        return self.get_day_display()
    





class CompanyStats(models.Model):
    years_in_business = models.PositiveIntegerField(default=0)
    projects_completed = models.PositiveIntegerField(default=0)
    client_satisfaction = models.PositiveIntegerField(default=100)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Company Statistics"
        verbose_name_plural = "Company Statistics"

    def __str__(self):
        return "Company Statistics"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass



