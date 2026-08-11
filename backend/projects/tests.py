import shutil
import tempfile
from datetime import date
from io import BytesIO
from pathlib import Path
from unittest.mock import MagicMock, patch

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from PIL import Image
from rest_framework.test import APIRequestFactory

from services.models import ServiceCategory

from .models import Project, ProjectImage
from .serializers import ProjectSerializer
from .utils.image_processing import optimize_project_image
from .views import (
    FeaturedProjectListView,
    HomepageFeaturedProjectListView,
    ProjectDetailView,
    ProjectListView,
)


def image_upload(name="project.png", size=(800, 600), image_format="PNG"):
    output = BytesIO()
    Image.new("RGB", size, "#6a7c52").save(output, format=image_format)
    return SimpleUploadedFile(
        name,
        output.getvalue(),
        content_type=f"image/{image_format.lower()}",
    )


class ProjectTestMixin:
    def setUp(self):
        super().setUp()
        self.category = ServiceCategory.objects.create(
            name="Decks & Porches",
            slug="decks-porches",
        )

    def create_project(self, **overrides):
        values = {
            "title": "Backyard Deck",
            "category": self.category,
            "caption": "A complete deck transformation.",
            "challenge": "The old structure was unsafe.",
            "approach": "We rebuilt it from the framing up.",
            "result": "A safe, durable outdoor space.",
        }
        values.update(overrides)
        return Project.objects.create(**values)

    def add_image(self, project, name="project.png", **overrides):
        values = {
            "project": project,
            "image": image_upload(name),
            "alt_text": "Finished project",
        }
        values.update(overrides)
        return ProjectImage.objects.create(**values)

    def publish(self, project):
        project.is_published = True
        project.save()
        project.refresh_from_db()
        return project


class ProjectModelTests(ProjectTestMixin, TestCase):
    def test_slug_is_unique_and_stays_stable(self):
        first = self.create_project(title="Deck & Porch")
        second = self.create_project(title="Deck Porch")
        self.assertEqual(first.slug, "deck-porch")
        self.assertEqual(second.slug, "deck-porch-2")

        first.title = "Renamed Project"
        first.save()
        self.assertEqual(first.slug, "deck-porch")

    def test_featured_fields_are_enforced_on_direct_save(self):
        with self.assertRaises(ValidationError):
            self.create_project(
                title="Incomplete",
                is_featured=True,
                caption="",
            )

    def test_completion_year_rejects_zero_old_and_future_values(self):
        for invalid_year in (0, 1899, date.today().year + 1):
            with self.subTest(invalid_year=invalid_year):
                with self.assertRaises(ValidationError):
                    self.create_project(
                        title=f"Year {invalid_year}",
                        completion_year=invalid_year,
                    )

    def test_materials_are_trimmed_and_deduplicated(self):
        project = self.create_project(
            materials="Cedar\n concrete \ncedar\n\nFasteners",
        )
        self.assertEqual(
            project.materials_list,
            ["Cedar", "concrete", "Fasteners"],
        )

    def test_published_project_requires_an_image(self):
        project = self.create_project()
        project.is_published = True
        with self.assertRaises(ValidationError):
            project.save()

    def test_featured_project_requires_three_images_before_publish(self):
        project = self.create_project(is_featured=True)
        self.add_image(project, "one.png")
        self.add_image(project, "two.png")
        project.is_published = True
        with self.assertRaises(ValidationError):
            project.save()

    def test_cover_falls_back_to_first_ordered_image(self):
        project = self.create_project()
        second = self.add_image(
            project,
            "second.png",
            display_order=2,
        )
        first = self.add_image(
            project,
            "first.png",
            display_order=1,
        )
        self.assertEqual(project.cover_image.pk, first.pk)

        second.is_cover = True
        second.save()
        self.assertEqual(project.cover_image.pk, second.pk)

    def test_direct_comparison_image_requires_complete_pair(self):
        project = self.create_project()
        self.add_image(project, "general.png")
        with self.assertRaises(ValidationError):
            self.add_image(
                project,
                "before.png",
                role=ProjectImage.Role.BEFORE,
            )

    def test_manager_creates_before_after_pair_atomically(self):
        project = self.create_project()
        self.add_image(project, "general.png")
        ProjectImage.objects.create_before_after(
            project=project,
            before={
                "image": image_upload("before.png"),
                "alt_text": "Before",
            },
            after={
                "image": image_upload("after.png"),
                "alt_text": "After",
            },
        )
        self.assertEqual(project.images.count(), 3)

    def test_deleting_last_image_or_half_pair_is_rejected(self):
        project = self.create_project()
        general = self.add_image(project, "general.png")
        with self.assertRaises(ValidationError):
            general.delete()

        ProjectImage.objects.create_before_after(
            project=project,
            before={
                "image": image_upload("before.png"),
                "alt_text": "Before",
            },
            after={
                "image": image_upload("after.png"),
                "alt_text": "After",
            },
        )
        before = project.images.get(role=ProjectImage.Role.BEFORE)
        with self.assertRaises(ValidationError):
            ProjectImage.objects.filter(pk=before.pk).delete()


class ProjectAPITests(ProjectTestMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.factory = APIRequestFactory()
        self.other_category = ServiceCategory.objects.create(
            name="Roofing",
            slug="roofing",
        )

        self.regular = self.create_project(
            title="Regular Deck",
            display_order=2,
        )
        self.add_image(self.regular, "regular.png", is_cover=True)
        self.publish(self.regular)

        self.featured = self.create_project(
            title="Featured Deck",
            is_featured=True,
            display_order=1,
        )
        for index in range(3):
            self.add_image(
                self.featured,
                f"featured-{index}.png",
                is_cover=index == 0,
                display_order=index,
            )
        self.publish(self.featured)

        self.unpublished = self.create_project(
            title="Hidden Roof",
            category=self.other_category,
        )
        self.add_image(self.unpublished, "hidden.png")

    def test_list_is_published_ordered_and_frontend_compatible(self):
        request = self.factory.get("/api/projects/")
        response = ProjectListView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [item["slug"] for item in response.data],
            [self.featured.slug, self.regular.slug],
        )
        self.assertEqual(
            set(response.data[0]),
            set(ProjectSerializer.Meta.fields),
        )
        self.assertTrue(
            response.data[0]["cover_image"]["image_url"].startswith(
                "http://testserver/"
            )
        )

    def test_category_filter_is_applied_to_both_full_lists(self):
        path = "/api/projects/?category=roofing"
        response = ProjectListView.as_view()(self.factory.get(path))
        featured_response = FeaturedProjectListView.as_view()(
            self.factory.get(
                "/api/projects/featured/?category=roofing"
            )
        )
        self.assertEqual(response.data, [])
        self.assertEqual(featured_response.data, [])

        response = ProjectListView.as_view()(
            self.factory.get(
                "/api/projects/?category=decks-porches"
            )
        )
        self.assertEqual(len(response.data), 2)

    def test_featured_and_homepage_endpoints_only_return_featured(self):
        featured = FeaturedProjectListView.as_view()(
            self.factory.get("/api/projects/featured/")
        )
        homepage = HomepageFeaturedProjectListView.as_view()(
            self.factory.get("/api/projects/homepage/")
        )
        self.assertEqual([item["slug"] for item in featured.data], [self.featured.slug])
        self.assertEqual([item["slug"] for item in homepage.data], [self.featured.slug])
        self.assertEqual(homepage.data[0]["homepage_size"], "standard")

    def test_detail_hides_unpublished_project(self):
        response = ProjectDetailView.as_view()(
            self.factory.get(f"/api/projects/{self.unpublished.slug}/"),
            slug=self.unpublished.slug,
        )
        self.assertEqual(response.status_code, 404)

    def test_list_query_count_does_not_grow_with_images(self):
        request = self.factory.get("/api/projects/")
        with self.assertNumQueries(2):
            response = ProjectListView.as_view()(request)
            list(response.data)


class ProjectImageLifecycleTests(ProjectTestMixin, TestCase):
    def setUp(self):
        self.media_root = tempfile.mkdtemp()
        self.override = override_settings(MEDIA_ROOT=self.media_root)
        self.override.enable()
        super().setUp()

    def tearDown(self):
        self.override.disable()
        shutil.rmtree(self.media_root, ignore_errors=True)
        super().tearDown()

    def test_replacement_deletes_old_file_after_commit(self):
        project = self.create_project()
        image = self.add_image(project, "old.png")
        old_path = Path(image.image.path)
        self.assertTrue(old_path.exists())

        image.image = image_upload("new.png")
        with self.captureOnCommitCallbacks(execute=True):
            image.save()
        self.assertFalse(old_path.exists())
        self.assertTrue(Path(image.image.path).exists())

    def test_update_fields_does_not_process_unsaved_image(self):
        project = self.create_project()
        image = self.add_image(project, "old.png")
        old_name = image.image.name
        image.image = image_upload("ignored.png")
        image.caption = "Updated"
        image.save(update_fields={"caption"})
        image.refresh_from_db()
        self.assertEqual(image.image.name, old_name)

    def test_project_cascade_deletes_all_files(self):
        project = self.create_project()
        image = self.add_image(project, "cascade.png")
        path = Path(image.image.path)
        with self.captureOnCommitCallbacks(execute=True):
            project.delete()
        self.assertFalse(path.exists())

    def test_failed_database_save_removes_new_optimized_file(self):
        project = self.create_project()
        image = ProjectImage(
            project=project,
            image=image_upload("failure.png"),
            alt_text="Failure",
        )
        with patch("django.db.models.Model.save", side_effect=RuntimeError):
            with self.assertRaises(RuntimeError):
                image.save()
        self.assertEqual(list(Path(self.media_root).rglob("*.*")), [])


class ProjectImageProcessingTests(TestCase):
    def test_malformed_and_animated_images_are_rejected(self):
        malformed = SimpleUploadedFile("bad.png", b"not an image")
        with self.assertRaises(ValidationError):
            optimize_project_image(malformed)

        output = BytesIO()
        frames = [
            Image.new("RGB", (20, 20), "red"),
            Image.new("RGB", (20, 20), "blue"),
        ]
        frames[0].save(
            output,
            format="GIF",
            save_all=True,
            append_images=frames[1:],
        )
        animated = SimpleUploadedFile("animated.gif", output.getvalue())
        with self.assertRaises(ValidationError):
            optimize_project_image(animated)

    def test_oversized_dimensions_are_rejected_before_decode(self):
        fake_image = MagicMock()
        fake_image.__enter__.return_value = fake_image
        fake_image.__exit__.return_value = False
        fake_image.size = (10_000, 5_000)
        fake_image.n_frames = 1
        upload = image_upload()
        with patch(
            "projects.utils.image_processing.Image.open",
            return_value=fake_image,
        ):
            with self.assertRaises(ValidationError):
                optimize_project_image(upload)

    def test_output_is_bounded_unique_webp(self):
        first_name, first = optimize_project_image(
            image_upload("My Project.JPG", size=(2500, 1000))
        )
        second_name, _second = optimize_project_image(
            image_upload("My Project.JPG", size=(2500, 1000))
        )
        self.assertNotEqual(first_name, second_name)
        self.assertTrue(first_name.endswith(".webp"))
        with Image.open(first) as image:
            self.assertLessEqual(max(image.size), 1920)
            self.assertEqual(image.format, "WEBP")