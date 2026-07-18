from io import BytesIO
from pathlib import Path
from uuid import uuid4

from PIL import Image, ImageOps

from django.core.files.base import ContentFile
from django.utils.text import slugify

PROFILE_IMAGE_MAX_DIMENSION = 512
PROFILE_IMAGE_WEBP_QUALITY = 85


def optimize_profile_image(image_field):
    """
    Convert an uploaded profile image to WebP and limit its longest
    edge to 512 pixels.

    The original aspect ratio is preserved and smaller images are
    never enlarged.
    """
    image_field.open("rb")

    with Image.open(image_field) as uploaded_image:
        # Correct rotation from phone-camera EXIF metadata.
        image = ImageOps.exif_transpose(uploaded_image)

        image.thumbnail(
            (
                PROFILE_IMAGE_MAX_DIMENSION,
                PROFILE_IMAGE_MAX_DIMENSION,
            ),
            Image.Resampling.LANCZOS,
        )

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
            quality=PROFILE_IMAGE_WEBP_QUALITY,
            method=6,
        )

    output.seek(0)

    original_stem = Path(image_field.name).stem
    safe_stem = slugify(original_stem) or "profile-image"
    unique_suffix = uuid4().hex[:10]

    optimized_name = (
        f"{safe_stem}-{unique_suffix}.webp"
    )

    return optimized_name, ContentFile(output.read())