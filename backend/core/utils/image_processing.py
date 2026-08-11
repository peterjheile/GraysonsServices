from io import BytesIO
from pathlib import Path
from uuid import uuid4

from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.utils.text import slugify
from PIL import Image, ImageOps, UnidentifiedImageError


LOGO_MAX_LONG_SIDE = 1000
FAVICON_SIZE = 192
SOCIAL_IMAGE_SIZE = (1200, 630)
LOGO_MAX_PIXELS = 20_000_000
FAVICON_MAX_PIXELS = 2048 * 2048
SOCIAL_IMAGE_MAX_PIXELS = 30_000_000


def _load_still_image(uploaded_file, *, max_pixels):
    """Decode one bounded still image and detach it from the input file."""
    try:
        uploaded_file.open("rb")
        with Image.open(uploaded_file) as source:
            width, height = source.size
            if width * height > max_pixels:
                raise ValidationError(
                    "This image is too large to process safely."
                )
            if getattr(source, "n_frames", 1) > 1:
                raise ValidationError(
                    "Animated images are not supported. "
                    "Please upload a still image."
                )

            oriented = ImageOps.exif_transpose(source)
            try:
                oriented.load()
                return oriented.copy()
            finally:
                if oriented is not source:
                    oriented.close()
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
        try:
            uploaded_file.seek(0)
        except (AttributeError, OSError, ValueError):
            pass


def _unique_name(uploaded_file, suffix, extension):
    stem = slugify(Path(uploaded_file.name).stem) or "site-image"
    return f"{stem}-{uuid4().hex[:10]}-{suffix}.{extension}"


def create_optimized_logo(uploaded_file):
    image = _load_still_image(
        uploaded_file,
        max_pixels=LOGO_MAX_PIXELS,
    )
    try:
        has_transparency = (
            image.mode in ("RGBA", "LA")
            or (image.mode == "P" and "transparency" in image.info)
        )
        converted = image.convert("RGBA" if has_transparency else "RGB")
        image.close()
        image = converted
        width, height = image.size
        longest_side = max(width, height)
        if longest_side > LOGO_MAX_LONG_SIDE:
            scale = LOGO_MAX_LONG_SIDE / longest_side
            resized = image.resize(
                (round(width * scale), round(height * scale)),
                Image.Resampling.LANCZOS,
            )
            image.close()
            image = resized

        with BytesIO() as output:
            image.save(output, format="WEBP", lossless=True, method=6)
            return ContentFile(
                output.getvalue(),
                name=_unique_name(uploaded_file, "optimized", "webp"),
            )
    finally:
        image.close()


def create_optimized_favicon(uploaded_file):
    image = _load_still_image(
        uploaded_file,
        max_pixels=FAVICON_MAX_PIXELS,
    )
    try:
        converted = image.convert("RGBA")
        image.close()
        image = converted
        resized = image.resize(
            (FAVICON_SIZE, FAVICON_SIZE),
            Image.Resampling.LANCZOS,
        )
        image.close()
        image = resized
        with BytesIO() as output:
            image.save(output, format="PNG", optimize=True)
            return ContentFile(
                output.getvalue(),
                name=_unique_name(uploaded_file, "favicon", "png"),
            )
    finally:
        image.close()


def create_optimized_social_image(uploaded_file):
    image = _load_still_image(
        uploaded_file,
        max_pixels=SOCIAL_IMAGE_MAX_PIXELS,
    )
    try:
        has_transparency = (
            image.mode in ("RGBA", "LA")
            or (image.mode == "P" and "transparency" in image.info)
        )
        if has_transparency:
            converted = image.convert("RGBA")
            image.close()
            image = converted
            background = Image.new("RGB", image.size, color="white")
            background.paste(image, mask=image.getchannel("A"))
            image.close()
            image = background
        else:
            converted = image.convert("RGB")
            image.close()
            image = converted

        fitted = ImageOps.fit(
            image,
            SOCIAL_IMAGE_SIZE,
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )
        image.close()
        image = fitted
        with BytesIO() as output:
            image.save(
                output,
                format="JPEG",
                quality=90,
                optimize=True,
                progressive=True,
            )
            return ContentFile(
                output.getvalue(),
                name=_unique_name(uploaded_file, "social", "jpg"),
            )
    finally:
        image.close()