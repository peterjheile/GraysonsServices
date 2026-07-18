from datetime import date

from django.core.exceptions import ValidationError
from django.core.validators import (
    MaxValueValidator,
    MinValueValidator,
)
from django.db import models

from .utils.image_processing import optimize_profile_image


class Review(models.Model):
    class Source(models.TextChoices):
        GOOGLE = "google", "Google"
        FACEBOOK = "facebook", "Facebook"
        IN_PERSON = "in_person", "In Person"

    class Month(models.IntegerChoices):
        JANUARY = 1, "January"
        FEBRUARY = 2, "February"
        MARCH = 3, "March"
        APRIL = 4, "April"
        MAY = 5, "May"
        JUNE = 6, "June"
        JULY = 7, "July"
        AUGUST = 8, "August"
        SEPTEMBER = 9, "September"
        OCTOBER = 10, "October"
        NOVEMBER = 11, "November"
        DECEMBER = 12, "December"

    reviewer_name = models.CharField(
        max_length=150,
    )

    role = models.CharField(
        max_length=150,
        blank=True,
        help_text=(
            'For example: "Homeowners" or '
            '"Homeowners · Bloomington, IN".'
        ),
    )

    quote = models.TextField()

    rating = models.PositiveSmallIntegerField(
        default=5,
        validators=(
            MinValueValidator(1),
            MaxValueValidator(5),
        ),
        help_text="Rating from 1 to 5 stars.",
    )

    source = models.CharField(
        max_length=20,
        choices=Source.choices,
        default=Source.GOOGLE,
    )

    category = models.ForeignKey(
        "services.ServiceCategory",
        on_delete=models.PROTECT,
        related_name="reviews",
        null=True,
        blank=True,
        help_text=(
            "Optional. Leave blank for a general review. "
            "When a project is selected, its category is used automatically."
        ),
    )

    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.PROTECT,
        related_name="reviews",
        null=True,
        blank=True,
        help_text=(
            "Optional for regular reviews. Required for featured reviews."
        ),
    )

    profile_image = models.ImageField(
        upload_to="reviews/profile-images/",
        null=True,
        blank=True,
        help_text=(
            "Optional. The image will automatically be converted to "
            "WebP and limited to 512 pixels on its longest edge. "
            "Initials will be displayed when no image is provided."
        ),
    )

    review_month = models.PositiveSmallIntegerField(
        choices=Month.choices,
    )

    review_year = models.PositiveSmallIntegerField(
        validators=(
            MinValueValidator(2015),
        ),
    )

    show_on_homepage = models.BooleanField(
        default=False,
        help_text=(
            "Select this review for display on the homepage. "
            "This can be enabled for regular or featured reviews."
        ),
    )

    is_featured = models.BooleanField(
        default=False,
        help_text=(
            "Featured reviews use the large review presentation. "
            "They must be connected to a project. "
            "A maximum of two featured homepage reviews is recommended."
        ),
    )

    homepage_order = models.PositiveIntegerField(
        default=0,
        help_text=(
            "Controls this review's position on the homepage. "
            "Only applies when homepage display is enabled."
        ),
    )

    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Controls the order on the complete Reviews page.",
    )

    is_active = models.BooleanField(
        default=True,
        help_text="Inactive reviews are hidden from the website.",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = (
            "display_order",
            "-review_year",
            "-review_month",
            "reviewer_name",
        )

        constraints = (
            models.CheckConstraint(
                condition=(
                    models.Q(is_featured=False)
                    | models.Q(project__isnull=False)
                ),
                name="featured_review_requires_project",
            ),
            models.CheckConstraint(
                condition=(
                    models.Q(rating__gte=1)
                    & models.Q(rating__lte=5)
                ),
                name="review_rating_between_1_and_5",
            ),
            models.CheckConstraint(
                condition=(
                    models.Q(review_month__gte=1)
                    & models.Q(review_month__lte=12)
                ),
                name="review_month_between_1_and_12",
            ),
        )

        verbose_name = "Review"
        verbose_name_plural = "Reviews"

    def __str__(self):
        return f"{self.reviewer_name} — {self.rating} stars"

    def clean(self):
        super().clean()

        errors = {}

        if self.review_year and self.review_year > date.today().year:
            errors["review_year"] = (
                "The review year cannot be in the future."
            )

        if self.is_featured and not self.project_id:
            errors["project"] = (
                "A featured review must be connected to a project."
            )

        if self.project_id and self.category_id:
            if self.project.category_id != self.category_id:
                errors["category"] = (
                    "The selected category does not match the "
                    "project's category."
                )

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        if self.is_featured and not self.project_id:
            raise ValidationError(
                {
                    "project": (
                        "A featured review must be connected "
                        "to a project."
                    )
                }
            )

        category_was_assigned = False

        # Use the project's category when no category was selected.
        if self.project_id and not self.category_id:
            self.category_id = self.project.category_id
            category_was_assigned = True

        has_new_profile_image = (
            self.profile_image
            and not self.profile_image._committed
        )

        if has_new_profile_image:
            optimized_name, optimized_content = optimize_profile_image(
                self.profile_image
            )

            self.profile_image.save(
                optimized_name,
                optimized_content,
                save=False,
            )

        update_fields = kwargs.get("update_fields")

        if update_fields is not None:
            update_fields = set(update_fields)

            if has_new_profile_image:
                update_fields.add("profile_image")

            if category_was_assigned:
                update_fields.add("category")

            kwargs["update_fields"] = update_fields

        super().save(*args, **kwargs)

    @property
    def initials(self):
        words = self.reviewer_name.split()

        if not words:
            return ""

        return "".join(
            word[0]
            for word in words[:2]
        ).upper()

    @property
    def formatted_review_date(self):
        return (
            f"{self.get_review_month_display()} "
            f"{self.review_year}"
        )