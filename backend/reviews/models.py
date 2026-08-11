import logging
from datetime import date

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models, transaction
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .utils.image_processing import optimize_profile_image


logger = logging.getLogger(__name__)


def _delete_profile_image(storage, name):
    """Delete a stored image without masking a committed database change."""
    if not name:
        return

    try:
        storage.delete(name)
    except Exception:
        logger.exception("Could not delete review profile image %s", name)


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

    reviewer_name = models.CharField(max_length=150)

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
        validators=(MinValueValidator(1), MaxValueValidator(5)),
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

    review_month = models.PositiveSmallIntegerField(choices=Month.choices)

    review_year = models.PositiveSmallIntegerField(
        validators=(MinValueValidator(2015),),
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

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
                condition=models.Q(rating__gte=1, rating__lte=5),
                name="review_rating_between_1_and_5",
            ),
            models.CheckConstraint(
                condition=models.Q(
                    review_month__gte=1,
                    review_month__lte=12,
                ),
                name="review_month_between_1_and_12",
            ),
            models.CheckConstraint(
                condition=models.Q(review_year__gte=2015),
                name="review_year_at_least_2015",
            ),
        )

        verbose_name = "Review"
        verbose_name_plural = "Reviews"

    def __str__(self):
        return f"{self.reviewer_name} — {self.rating} stars"

    def _synchronize_project_category(self):
        """Make the selected project's category authoritative."""
        if not self.project_id:
            return False

        project_category_id = self.project.category_id
        if self.category_id == project_category_id:
            return False

        self.category_id = project_category_id
        return True

    def clean(self):
        super().clean()

        errors = {}
        today = date.today()

        if (
            self.review_year
            and self.review_month
            and (self.review_year, self.review_month)
            > (today.year, today.month)
        ):
            errors["review_month"] = (
                "The review month and year cannot be in the future."
            )

        if self.is_featured and not self.project_id:
            errors["project"] = (
                "A featured review must be connected to a project."
            )

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        category_changed = self._synchronize_project_category()

        update_fields = kwargs.get("update_fields")
        if update_fields is not None:
            update_fields = set(update_fields)
            if category_changed:
                update_fields.add("category")
            kwargs["update_fields"] = update_fields

        # Model.save() does not normally run validation. Enforce the same
        # rules for admin, shell scripts, imports, and direct ORM creates.
        self.full_clean()

        profile_image_is_being_saved = (
            update_fields is None or "profile_image" in update_fields
        )

        previous_image = None
        if self.pk and profile_image_is_being_saved:
            previous_image = (
                type(self).objects.only("profile_image").filter(pk=self.pk).first()
            )

        has_new_profile_image = (
            profile_image_is_being_saved
            and self.profile_image
            and not self.profile_image._committed
        )

        created_image = None
        try:
            if has_new_profile_image:
                optimized_name, optimized_content = optimize_profile_image(
                    self.profile_image
                )
                self.profile_image.save(
                    optimized_name,
                    optimized_content,
                    save=False,
                )
                created_image = (
                    self.profile_image.storage,
                    self.profile_image.name,
                )

                if update_fields is not None:
                    update_fields.add("profile_image")
                    kwargs["update_fields"] = update_fields

            super().save(*args, **kwargs)
        except Exception:
            if created_image:
                _delete_profile_image(*created_image)
            raise

        previous_name = (
            previous_image.profile_image.name
            if previous_image and previous_image.profile_image
            else ""
        )
        current_name = self.profile_image.name if self.profile_image else ""

        if previous_name and previous_name != current_name:
            storage = previous_image.profile_image.storage
            transaction.on_commit(
                lambda storage=storage, name=previous_name: (
                    _delete_profile_image(storage, name)
                )
            )

    @property
    def initials(self):
        words = self.reviewer_name.split()
        if not words:
            return ""

        return "".join(word[0] for word in words[:2]).upper()

    @property
    def formatted_review_date(self):
        return f"{self.get_review_month_display()} {self.review_year}"


@receiver(
    post_delete,
    sender=Review,
    dispatch_uid="reviews.delete_profile_image",
)
def delete_review_profile_image(sender, instance, **kwargs):
    """Delete the stored profile image after a Review deletion commits."""
    if not instance.profile_image or not instance.profile_image.name:
        return

    storage = instance.profile_image.storage
    name = instance.profile_image.name
    transaction.on_commit(
        lambda: _delete_profile_image(storage, name)
    )


@receiver(
    post_save,
    sender="projects.Project",
    dispatch_uid="reviews.synchronize_project_categories",
)
def synchronize_project_review_categories(sender, instance, **kwargs):
    """Keep existing reviews aligned when a project's category changes."""
    Review.objects.filter(project_id=instance.pk).exclude(
        category_id=instance.category_id
    ).update(category_id=instance.category_id)