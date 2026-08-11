from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import IntegrityError, models, router, transaction
from django.db.models import F, Q
from django.utils import timezone
from django.utils.text import slugify


MAX_SLUG_SAVE_ATTEMPTS = 5


def _build_unique_slug(instance, source, *, fallback, using):
    """Return a nonempty, length-safe slug that is currently unique."""
    slug_field = instance._meta.get_field("slug")
    max_length = slug_field.max_length

    base_slug = (slugify(source) or fallback)[:max_length].strip("-")
    base_slug = base_slug or fallback[:max_length]

    queryset = (
        type(instance)
        ._default_manager.using(using)
        .exclude(pk=instance.pk)
    )
    candidate = base_slug
    number = 2

    while queryset.filter(slug=candidate).exists():
        suffix = f"-{number}"
        trimmed_base = base_slug[: max_length - len(suffix)].rstrip("-")
        candidate = f"{trimmed_base}{suffix}"
        number += 1

    return candidate


def _include_generated_slug(update_fields):
    """Persist a newly generated slug during a partial model save."""
    if update_fields is None:
        return None

    return set(update_fields) | {"slug"}


class AutoSlugModelMixin:
    """Generate stable slugs, validate direct saves, and retry slug races."""

    slug_source_field = None
    slug_fallback = None

    def save(self, *args, **kwargs):
        using = kwargs.get("using") or router.db_for_write(
            type(self),
            instance=self,
        )
        generated_slug = not self.slug

        if generated_slug:
            kwargs["update_fields"] = _include_generated_slug(
                kwargs.get("update_fields")
            )

        for attempt in range(MAX_SLUG_SAVE_ATTEMPTS):
            if not self.slug:
                self.slug = _build_unique_slug(
                    self,
                    getattr(self, self.slug_source_field),
                    fallback=self.slug_fallback,
                    using=using,
                )

            # Django does not call full_clean() from Model.save() by default.
            # Calling it here gives every direct save the same friendly model
            # and field validation that an admin ModelForm receives.
            try:
                self.full_clean()
            except ValidationError as error:
                slug_was_claimed = (
                    generated_slug
                    and "slug" in error.message_dict
                    and type(self)
                    ._default_manager.using(using)
                    .exclude(pk=self.pk)
                    .filter(slug=self.slug)
                    .exists()
                )

                if (
                    not slug_was_claimed
                    or attempt == MAX_SLUG_SAVE_ATTEMPTS - 1
                ):
                    raise

                self.slug = ""
                continue

            try:
                # A savepoint keeps the connection usable if a concurrent
                # insert claims the generated slug between our query and save.
                with transaction.atomic(using=using):
                    return super().save(*args, **kwargs)
            except IntegrityError:
                slug_was_claimed = (
                    type(self)
                    ._default_manager.using(using)
                    .exclude(pk=self.pk)
                    .filter(slug=self.slug)
                    .exists()
                )

                if (
                    not generated_slug
                    or not slug_was_claimed
                    or attempt == MAX_SLUG_SAVE_ATTEMPTS - 1
                ):
                    raise

                self.slug = ""


class JobCategory(AutoSlugModelMixin, models.Model):
    """An admin-managed group such as Field Operations or Marketing."""

    slug_source_field = "name"
    slug_fallback = "job-category"

    name = models.CharField(
        max_length=100,
        unique=True,
    )
    slug = models.SlugField(
        max_length=110,
        unique=True,
        blank=True,
        editable=False,
    )
    display_order = models.PositiveIntegerField(
        default=0,
    )
    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        ordering = ("display_order", "name")
        verbose_name = "Job Category"
        verbose_name_plural = "Job Categories"
        constraints = (
            models.CheckConstraint(
                condition=~Q(slug=""),
                name="careers_cat_slug_not_empty",
            ),
        )

    def __str__(self):
        return self.name


class JobPosting(AutoSlugModelMixin, models.Model):
    slug_source_field = "title"
    slug_fallback = "job"

    class Seniority(models.TextChoices):
        ENTRY = "entry", "Entry Level"
        MID_LEVEL = "mid-level", "Mid-Level"
        SENIOR = "senior", "Senior"
        LEAD = "lead", "Lead"
        MANAGER = "manager", "Manager"

    class EmploymentType(models.TextChoices):
        FULL_TIME = "full-time", "Full-Time"
        PART_TIME = "part-time", "Part-Time"
        SEASONAL = "seasonal", "Seasonal"
        TEMPORARY = "temporary", "Temporary"
        CONTRACT = "contract", "Contract"
        INTERNSHIP = "internship", "Internship"

    class PayUnit(models.TextChoices):
        HOUR = "hour", "Per Hour"
        DAY = "day", "Per Day"
        WEEK = "week", "Per Week"
        YEAR = "year", "Per Year"
        PROJECT = "project", "Per Project"

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        OPEN = "open", "Open"
        CLOSED = "closed", "Closed"

    category = models.ForeignKey(
        JobCategory,
        on_delete=models.PROTECT,
        related_name="job_postings",
    )
    title = models.CharField(
        max_length=150,
    )
    slug = models.SlugField(
        max_length=170,
        unique=True,
        blank=True,
        editable=False,
    )
    location = models.CharField(
        max_length=150,
    )
    seniority = models.CharField(
        max_length=20,
        choices=Seniority.choices,
        blank=True,
        help_text="Leave blank when a seniority badge does not apply.",
    )
    employment_type = models.CharField(
        max_length=20,
        choices=EmploymentType.choices,
    )
    is_urgent = models.BooleanField(
        default=False,
    )
    posted_at = models.DateField(
        default=timezone.localdate,
    )
    pay_min = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=(MinValueValidator(0),),
    )
    pay_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=(MinValueValidator(0),),
    )
    pay_unit = models.CharField(
        max_length=20,
        choices=PayUnit.choices,
        default=PayUnit.HOUR,
    )
    description = models.TextField(
        max_length=5000,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )
    display_order = models.PositiveIntegerField(
        default=0,
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ("display_order", "-posted_at", "title", "pk")
        verbose_name = "Job Posting"
        verbose_name_plural = "Job Postings"
        constraints = (
            models.CheckConstraint(
                condition=(
                    (
                        Q(pay_min__isnull=True)
                        & Q(pay_max__isnull=True)
                    )
                    | (
                        Q(pay_min__isnull=False)
                        & Q(pay_max__isnull=False)
                        & Q(pay_min__gte=0)
                        & Q(pay_max__gte=F("pay_min"))
                    )
                ),
                name="careers_job_valid_pay_range",
            ),
            models.CheckConstraint(
                condition=~Q(slug=""),
                name="careers_job_slug_not_empty",
            ),
        )

    def clean(self):
        super().clean()

        has_minimum = self.pay_min is not None
        has_maximum = self.pay_max is not None

        if has_minimum != has_maximum:
            raise ValidationError(
                {
                    "pay_max": (
                        "Enter both ends of the pay range, or leave both blank."
                    )
                }
            )

        if (
            has_minimum
            and has_maximum
            and self.pay_max < self.pay_min
        ):
            raise ValidationError(
                {"pay_max": "Maximum pay cannot be below minimum pay."}
            )

    def __str__(self):
        return self.title


class OrderedJobItem(models.Model):
    text = models.CharField(
        max_length=500,
    )
    display_order = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        abstract = True


class JobResponsibility(OrderedJobItem):
    job_posting = models.ForeignKey(
        JobPosting,
        on_delete=models.CASCADE,
        related_name="responsibilities",
    )

    class Meta:
        ordering = ("display_order", "pk")
        verbose_name = "Job Responsibility"
        verbose_name_plural = "Job Responsibilities"

    def __str__(self):
        return f"{self.job_posting}: {self.text[:60]}"


class JobRequirement(OrderedJobItem):
    job_posting = models.ForeignKey(
        JobPosting,
        on_delete=models.CASCADE,
        related_name="requirements",
    )

    class Meta:
        ordering = ("display_order", "pk")
        verbose_name = "Job Requirement"
        verbose_name_plural = "Job Requirements"

    def __str__(self):
        return f"{self.job_posting}: {self.text[:60]}"


class JobNiceToHave(OrderedJobItem):
    job_posting = models.ForeignKey(
        JobPosting,
        on_delete=models.CASCADE,
        related_name="nice_to_haves",
    )

    class Meta:
        ordering = ("display_order", "pk")
        verbose_name = "Job Nice to Have"
        verbose_name_plural = "Job Nice to Haves"

    def __str__(self):
        return f"{self.job_posting}: {self.text[:60]}"