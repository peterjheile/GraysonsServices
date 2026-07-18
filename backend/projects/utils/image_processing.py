from io import BytesIO
from pathlib import Path
from uuid import uuid4

from django.core.files.base import ContentFile
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify
from PIL import Image, ImageOps

PROJECT_IMAGE_MAX_DIMENSION = 1920
PROJECT_IMAGE_WEBP_QUALITY = 85


def optimize_project_image(image_field):
    """
    Convert an uploaded project image to an optimized WebP.

    The image's aspect ratio is preserved, smaller images are not enlarged,
    and the longest edge is limited to PROJECT_IMAGE_MAX_DIMENSION.
    """
    image_field.open("rb")

    with Image.open(image_field) as uploaded_image:
        # Correct rotation from phone-camera EXIF information.
        image = ImageOps.exif_transpose(uploaded_image)

        # Resize only when the image exceeds the maximum dimensions.
        image.thumbnail(
            (
                PROJECT_IMAGE_MAX_DIMENSION,
                PROJECT_IMAGE_MAX_DIMENSION,
            ),
            Image.Resampling.LANCZOS,
        )

        # Preserve transparency when present.
        has_transparency = (
            image.mode in ("RGBA", "LA")
            or (
                image.mode == "P"
                and "transparency" in image.info
            )
        )

        if has_transparency:
            image = image.convert("RGBA")
        else:
            image = image.convert("RGB")

        output = BytesIO()

        image.save(
            output,
            format="WEBP",
            quality=PROJECT_IMAGE_WEBP_QUALITY,
            method=6,
        )

    output.seek(0)

    original_stem = Path(image_field.name).stem
    safe_stem = slugify(original_stem) or "project-image"
    unique_suffix = uuid4().hex[:10]

    optimized_name = (
        f"{safe_stem}-{unique_suffix}.webp"
    )

    return optimized_name, ContentFile(output.read())