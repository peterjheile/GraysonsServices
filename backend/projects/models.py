import logging
from datetime import date

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models, transaction
from django.db.models import Q
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.utils.text import slugify

from .utils.image_processing import optimize_project_image


logger = logging.getLogger(__name__)


def validate_completion_year(value):
    """Reject completion years that are in the future."""
    if value is not None and value > date.today().year:
        raise ValidationError("Completion year cannot be in the future.")


def _delete_project_image(storage, name):
    """Delete a stored image without masking a committed database change."""
    if not name:
        return

    try:
        storage.delete(name)
    except Exception:
        logger.exception("Could not delete project image %s", name)


class Project(models.Model):
    class HomepageSize(models.TextChoices):
        STANDARD = "standard", "Standard"
        TALL = "tall", "Tall"
        WIDE = "wide", "Wide"

    category = models.ForeignKey(
        "services.ServiceCategory",
        on_delete=models.PROTECT,
        related_name="projects",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    caption = models.TextField(
        blank=True,
        help_text="A short description shown beneath the project.",
    )
    is_featured = models.BooleanField(
        default=False,
        help_text="Featured projects appear as detailed case studies.",
    )
    is_published = models.BooleanField(
        default=False,
        help_text="Only published projects are visible on the website.",
    )
    homepage_size = models.CharField(
        max_length=10,
        choices=HomepageSize.choices,
        default=HomepageSize.STANDARD,
        help_text=(
            "Controls this featured project's card size on the homepage."
        ),
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Lower numbers appear first.",
    )

    # Featured-project details
    location = models.CharField(max_length=150, blank=True)
    completion_year = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=(MinValueValidator(1900), validate_completion_year),
    )
    duration = models.CharField(max_length=100, blank=True)
    area = models.CharField(
        max_length=100,
        blank=True,
        help_text='For example: "1,200 sq ft".',
    )
    challenge = models.TextField(blank=True)
    approach = models.TextField(blank=True)
    result = models.TextField(blank=True)
    materials = models.TextField(
        blank=True,
        help_text="Enter one material per line.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("display_order", "-completion_year", "title")
        constraints = (
            models.CheckConstraint(
                condition=(
                    Q(completion_year__isnull=True)
                    | Q(completion_year__gte=1900)
                ),
                name="project_completion_year_at_least_1900",
            ),
        )

    def __str__(self):
        return self.title

    @property
    def materials_list(self):
        materials = []
        seen = set()

        for line in self.materials.splitlines():
            material = line.strip()
            key = material.casefold()
            if material and key not in seen:
                seen.add(key)
                materials.append(material)

        return materials

    @property
    def cover_image(self):
        images = self.images.all()
        return (
            next((image for image in images if image.is_cover), None)
            or next(iter(images), None)
        )

    def clean(self):
        super().clean()
        errors = {}

        if self.completion_year is not None:
            try:
                validate_completion_year(self.completion_year)
            except ValidationError as error:
                errors["completion_year"] = error.messages

        if self.is_featured:
            required_fields = {
                "category": self.category,
                "caption": self.caption,
                "challenge": self.challenge,
                "approach": self.approach,
                "result": self.result,
            }
            for field_name, value in required_fields.items():
                if value is None or (
                    isinstance(value, str) and not value.strip()
                ):
                    errors[field_name] = (
                        "This field is required for a featured project."
                    )

        if errors:
            raise ValidationError(errors)

    def validate_image_set(self, images=None):
        """Validate the complete saved image collection for this project."""
        if images is None:
            images = list(self.images.all())
        else:
            images = list(images)

        image_count = len(images)
        if image_count == 0:
            raise ValidationError(
                "Every project must have at least one image."
            )
        if self.is_featured and image_count < 3:
            raise ValidationError(
                "Featured projects must have at least three images."
            )

        before_count = sum(
            image.role == ProjectImage.Role.BEFORE for image in images
        )
        after_count = sum(
            image.role == ProjectImage.Role.AFTER for image in images
        )
        if before_count != after_count:
            raise ValidationError(
                "A before-and-after comparison requires both a before "
                "image and an after image."
            )

    def save(self, *args, **kwargs):
        skip_image_set_validation = kwargs.pop(
            "skip_image_set_validation",
            False,
        ) or getattr(self, "_skip_image_set_validation", False)

        if not self.slug:
            self.slug = self._generate_unique_slug()

        update_fields = kwargs.get("update_fields")
        if update_fields is not None:
            update_fields = set(update_fields)
            if self._state.adding or not self.slug:
                update_fields.add("slug")
            kwargs["update_fields"] = update_fields
            editable_fields = {
                field.name
                for field in self._meta.fields
                if field.editable and not field.primary_key
            }
            exclude = editable_fields - update_fields
        else:
            exclude = None

        self.full_clean(exclude=exclude)

        if not skip_image_set_validation:
            if self._state.adding and self.is_published:
                raise ValidationError(
                    "Add the required project images before publishing."
                )
            if not self._state.adding and (
                self.is_published or self.is_featured
            ):
                self.validate_image_set()

        super().save(*args, **kwargs)

    def _generate_unique_slug(self):
        base_slug = slugify(self.title) or "project"
        max_base_length = self._meta.get_field("slug").max_length - 12
        base_slug = base_slug[:max_base_length].rstrip("-") or "project"
        candidate = base_slug
        suffix = 2

        while type(self).objects.filter(slug=candidate).exclude(
            pk=self.pk
        ).exists():
            suffix_text = f"-{suffix}"
            candidate = f"{base_slug[:170 - len(suffix_text)]}{suffix_text}"
            suffix += 1

        return candidate


class ProjectImageQuerySet(models.QuerySet):
    protected_update_fields = {
        "project",
        "project_id",
        "image",
        "role",
        "is_cover",
    }

    def update(self, **kwargs):
        if self.protected_update_fields.intersection(kwargs):
            raise ValidationError(
                "Use ProjectImage.save() for project, image, role, or cover "
                "changes so validation and file cleanup are preserved."
            )
        return super().update(**kwargs)

    def bulk_create(self, objs, **kwargs):
        raise ValidationError(
            "Project images must be saved normally so they can be "
            "validated and optimized."
        )

    def bulk_update(self, objs, fields, **kwargs):
        if self.protected_update_fields.intersection(fields):
            raise ValidationError(
                "Use ProjectImage.save() for project, image, role, or cover "
                "changes so validation and file cleanup are preserved."
            )
        return super().bulk_update(objs, fields, **kwargs)

    def delete(self, *args, **kwargs):
        target_ids = set(self.values_list("pk", flat=True))
        project_ids = set(self.values_list("project_id", flat=True))

        for project in Project.objects.filter(pk__in=project_ids):
            remaining = list(
                project.images.exclude(pk__in=target_ids)
            )
            project.validate_image_set(remaining)

        return super().delete(*args, **kwargs)


class ProjectImageManager(models.Manager.from_queryset(ProjectImageQuerySet)):
    def create_before_after(
        self,
        *,
        project,
        before,
        after,
    ):
        """Create a valid before/after pair in one transaction."""
        before_image = self.model(
            project=project,
            role=self.model.Role.BEFORE,
            **before,
        )
        after_image = self.model(
            project=project,
            role=self.model.Role.AFTER,
            **after,
        )
        try:
            with transaction.atomic():
                before_image.save(skip_image_set_validation=True)
                after_image.save(skip_image_set_validation=True)
                project.validate_image_set()
        except Exception:
            files = tuple(
                (image.image.storage, image.image.name)
                for image in (before_image, after_image)
                if (
                    image.image
                    and image.image.name
                    and image.image._committed
                )
            )
            for storage, name in files:
                _delete_project_image(storage, name)
            raise
        return before_image, after_image


class ProjectImage(models.Model):
    class Role(models.TextChoices):
        GENERAL = "general", "General"
        BEFORE = "before", "Before"
        AFTER = "after", "After"

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(
        upload_to="projects/images/",
        help_text=(
            "The image will automatically be converted to WebP and "
            "limited to 1920 pixels."
        ),
    )
    alt_text = models.CharField(
        max_length=250,
        help_text="Briefly describe what is visible in the image.",
    )
    caption = models.CharField(max_length=250, blank=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.GENERAL,
    )
    is_cover = models.BooleanField(
        default=False,
        help_text=(
            "Use this as the project's main image. If none is selected "
            "for a project, the first in display order is used."
        ),
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Lower numbers appear first.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ProjectImageManager()

    class Meta:
        ordering = ("display_order", "id")
        constraints = (
            models.UniqueConstraint(
                fields=("project",),
                condition=Q(is_cover=True),
                name="one_cover_image_per_project",
            ),
            models.UniqueConstraint(
                fields=("project",),
                condition=Q(role="before"),
                name="one_before_image_per_project",
            ),
            models.UniqueConstraint(
                fields=("project",),
                condition=Q(role="after"),
                name="one_after_image_per_project",
            ),
        )

    def __str__(self):
        return f"{self.project.title} — {self.get_role_display()}"

    def clean(self):
        super().clean()
        errors = {}

        if self.is_cover and self.project_id:
            if type(self).objects.filter(
                project_id=self.project_id,
                is_cover=True,
            ).exclude(pk=self.pk).exists():
                errors["is_cover"] = (
                    "This project already has a cover image."
                )

        if self.role != self.Role.GENERAL and self.project_id:
            if type(self).objects.filter(
                project_id=self.project_id,
                role=self.role,
            ).exclude(pk=self.pk).exists():
                errors["role"] = (
                    f"This project already has a "
                    f"{self.get_role_display().lower()} image."
                )

        if errors:
            raise ValidationError(errors)

    def _projected_image_set(self):
        images = list(
            type(self).objects.filter(project_id=self.project_id).exclude(
                pk=self.pk
            )
        )
        images.append(self)
        return images

    def save(self, *args, **kwargs):
        skip_image_set_validation = kwargs.pop(
            "skip_image_set_validation",
            False,
        ) or getattr(self, "_skip_image_set_validation", False)
        update_fields = kwargs.get("update_fields")
        if update_fields is not None:
            update_fields = set(update_fields)
            kwargs["update_fields"] = update_fields

        image_is_being_saved = (
            update_fields is None or "image" in update_fields
        )
        previous = None
        if self.pk:
            previous = type(self).objects.filter(pk=self.pk).first()

        editable_fields = {
            field.name
            for field in self._meta.fields
            if field.editable and not field.primary_key
        }
        exclude = None if update_fields is None else editable_fields - update_fields
        self.full_clean(exclude=exclude)

        role_is_being_saved = (
            update_fields is None or "role" in update_fields
        )
        role_changed = bool(
            previous
            and role_is_being_saved
            and previous.role != self.role
        )
        is_comparison_creation = (
            self._state.adding and self.role != self.Role.GENERAL
        )
        if (
            not skip_image_set_validation
            and (role_changed or is_comparison_creation)
        ):
            self.project.validate_image_set(self._projected_image_set())

        previous_image = (
            previous.image if previous and image_is_being_saved else None
        )
        has_new_image = (
            image_is_being_saved
            and self.image
            and not self.image._committed
        )
        created_file = None

        try:
            if has_new_image:
                optimized_name, optimized_content = optimize_project_image(
                    self.image
                )
                self.image.save(
                    optimized_name,
                    optimized_content,
                    save=False,
                )
                created_file = (self.image.storage, self.image.name)

            super().save(*args, **kwargs)
        except Exception:
            if created_file:
                _delete_project_image(*created_file)
            raise

        previous_name = (
            previous_image.name if previous_image and previous_image.name else ""
        )
        current_name = self.image.name if self.image else ""
        if previous_name and previous_name != current_name:
            storage = previous_image.storage
            transaction.on_commit(
                lambda storage=storage, name=previous_name: (
                    _delete_project_image(storage, name)
                )
            )

    def delete(self, *args, **kwargs):
        skip_image_set_validation = kwargs.pop(
            "skip_image_set_validation",
            False,
        ) or getattr(self, "_skip_image_set_validation", False)
        if not skip_image_set_validation:
            remaining = list(
                self.project.images.exclude(pk=self.pk)
            )
            self.project.validate_image_set(remaining)
        return super().delete(*args, **kwargs)


@receiver(
    post_delete,
    sender=ProjectImage,
    dispatch_uid="projects.delete_project_image",
)
def delete_project_image_file(sender, instance, **kwargs):
    """Delete the stored file after its ProjectImage row is committed."""
    if not instance.image or not instance.image.name:
        return

    storage = instance.image.storage
    name = instance.image.name
    transaction.on_commit(
        lambda: _delete_project_image(storage, name)
    )