from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify
from .utils.image_processing import optimize_project_image


class Project(models.Model):
    category = models.ForeignKey(
        "services.ServiceCategory",
        on_delete=models.PROTECT,
        related_name="projects",
    )

    title = models.CharField(
        max_length=150,
    )

    slug = models.SlugField(
        max_length=170,
        unique=True,
        blank=True,
    )

    location = models.CharField(
        max_length=150,
        blank=True,
    )

    completion_year = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    short_description = models.TextField(
        blank=True,
        help_text="A brief overview of the project.",
    )

    # Featured case-study information
    duration = models.CharField(
        max_length=100,
        blank=True,
    )

    area = models.CharField(
        max_length=100,
        blank=True,
        help_text='For example: "1,200 sq ft".',
    )

    challenge = models.TextField(
        blank=True,
    )

    approach = models.TextField(
        blank=True,
    )

    result = models.TextField(
        blank=True,
    )

    materials = models.TextField(
        blank=True,
        help_text="Enter one material per line.",
    )

    # Project-page presentation
    is_featured = models.BooleanField(
        default=False,
        help_text=(
            "Featured projects receive the large case-study layout "
            "on the Projects page."
        ),
    )

    featured_order = models.PositiveIntegerField(
        default=0,
        help_text="Controls the order of featured projects.",
    )

    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Controls the order in the regular project gallery.",
    )

    is_published = models.BooleanField(
        default=False,
        help_text="Only published projects are visible on the website.",
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
            "-completion_year",
            "title",
        )
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        return self.title

    def clean(self):
        super().clean()

        if not self.is_featured or not self.is_published:
            return

        required_fields = {
            "short_description": self.short_description,
            "challenge": self.challenge,
            "approach": self.approach,
            "result": self.result,
        }

        errors = {}

        for field_name, value in required_fields.items():
            if not value or not value.strip():
                errors[field_name] = (
                    "This field is required for a published featured project."
                )

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._generate_unique_slug()

        super().save(*args, **kwargs)

    def _generate_unique_slug(self):
        base_slug = slugify(self.title) or "project"
        slug = base_slug
        number = 2

        while Project.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug = f"{base_slug}-{number}"
            number += 1

        return slug


class ProjectImage(models.Model):
    class ImageType(models.TextChoices):
        BEFORE = "before", "Before"
        AFTER = "after", "After"
        PROCESS = "process", "Process"
        FINISHED = "finished", "Finished"
        DETAIL = "detail", "Detail"

    class HomepageSize(models.TextChoices):
        STANDARD = "standard", "Standard"
        TALL = "tall", "Tall"
        WIDE = "wide", "Wide"

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="images",
    )

    image = models.ImageField(
        upload_to="projects/images/",
        help_text=(
            "Upload the highest-quality version available. "
            "The image will automatically be converted to WebP and "
            "limited to 1920 pixels on its longest edge."
        ),
    )

    alt_text = models.CharField(
        max_length=250,
        help_text=(
            "Briefly describe what is visible in the image "
            "for accessibility and search engines."
        ),
    )

    caption = models.CharField(
        max_length=250,
        blank=True,
    )

    image_type = models.CharField(
        max_length=20,
        choices=ImageType.choices,
        default=ImageType.FINISHED,
    )

    is_cover = models.BooleanField(
        default=False,
        help_text=(
            "Use this as the project's main image in the regular "
            "Projects gallery."
        ),
    )

    # Homepage presentation
    show_on_homepage = models.BooleanField(
        default=False,
        help_text="Include this exact image in the homepage project gallery.",
    )

    homepage_order = models.PositiveIntegerField(
        default=0,
        help_text="Controls where this image appears on the homepage.",
    )

    homepage_size = models.CharField(
        max_length=20,
        choices=HomepageSize.choices,
        default=HomepageSize.STANDARD,
        help_text="Controls the size of this image in the homepage grid.",
    )

    # Project detail-page presentation
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Controls the image order within the project.",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = (
            "project",
            "display_order",
            "id",
        )
        verbose_name = "Project Image"
        verbose_name_plural = "Project Images"

    def __str__(self):
        return f"{self.project.title} — {self.get_image_type_display()}"

    def save(self, *args, **kwargs):
        # A newly uploaded or replaced image has not yet been committed
        # to Django's storage.
        has_new_image = (
            self.image
            and not self.image._committed
        )

        if has_new_image:
            optimized_name, optimized_content = optimize_project_image(
                self.image
            )

            self.image.save(
                optimized_name,
                optimized_content,
                save=False,
            )

        # Ensure that each project has only one cover image.
        if self.is_cover and self.project_id:
            ProjectImage.objects.filter(
                project_id=self.project_id,
                is_cover=True,
            ).exclude(pk=self.pk).update(is_cover=False)

        super().save(*args, **kwargs)