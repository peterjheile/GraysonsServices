from io import BytesIO
from pathlib import Path
from uuid import uuid4

from PIL import Image, ImageOps, UnidentifiedImageError

from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.utils.text import slugify


SERVICE_IMAGE_WEBP_QUALITY = 82
SERVICE_IMAGE_MAX_PIXELS = 40_000_000

PRIMARY_IMAGE_MAX_DIMENSION = 1920
SUPPORTING_IMAGE_MAX_DIMENSION = 1600


def optimize_service_image(
    image_field,
    *,
    max_dimension: int,
) -> tuple[str, ContentFile]:
    """Validate and convert a still service image to a bounded WebP file."""
    if max_dimension <= 0:
        raise ValueError("max_dimension must be greater than zero.")

    original_stem = Path(image_field.name).stem

    try:
        image_field.open("rb")

        with Image.open(image_field) as uploaded_image:
            width, height = uploaded_image.size
            if width * height > SERVICE_IMAGE_MAX_PIXELS:
                raise ValidationError(
                    "This image is too large to process safely. "
                    "Please upload an image smaller than 40 megapixels."
                )

            if getattr(uploaded_image, "n_frames", 1) > 1:
                raise ValidationError(
                    "Animated images are not supported. "
                    "Please upload a still image."
                )

            image = ImageOps.exif_transpose(uploaded_image)
            image.thumbnail(
                (max_dimension, max_dimension),
                Image.Resampling.LANCZOS,
            )

            has_transparency = (
                image.mode in ("RGBA", "LA")
                or (
                    image.mode == "P"
                    and "transparency" in image.info
                )
            )
            image = image.convert("RGBA" if has_transparency else "RGB")

            with BytesIO() as output:
                image.save(
                    output,
                    format="WEBP",
                    quality=SERVICE_IMAGE_WEBP_QUALITY,
                    method=6,
                )
                optimized_content = ContentFile(output.getvalue())
    except ValidationError:
        raise
    except (
        Image.DecompressionBombError,
        UnidentifiedImageError,
        OSError,
        SyntaxError,
        ValueError,
    ) as error:
        raise ValidationError(
            "The uploaded file is not a valid supported image."
        ) from error
    finally:
        image_field.close()

    safe_stem = slugify(original_stem) or "service-image"
    unique_suffix = uuid4().hex[:10]
    optimized_name = f"{safe_stem}-{unique_suffix}.webp"

    return optimized_name, optimized_content