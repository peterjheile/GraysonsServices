import warnings

from django.core.exceptions import ValidationError
from PIL import Image, ImageOps, UnidentifiedImageError


MAX_LOGO_FILE_SIZE = 2 * 1024 * 1024
MAX_LOGO_PIXELS = 20_000_000
MIN_LOGO_LONG_SIDE = 600
MIN_LOGO_SHORT_SIDE = 100
MAX_LOGO_ASPECT_RATIO = 10
ALLOWED_LOGO_FORMATS = {"JPEG", "PNG", "WEBP"}

MAX_FAVICON_FILE_SIZE = 1 * 1024 * 1024
MIN_FAVICON_SIZE = 192
MAX_FAVICON_SIZE = 2048
MAX_FAVICON_PIXELS = MAX_FAVICON_SIZE * MAX_FAVICON_SIZE
ALLOWED_FAVICON_FORMATS = {"JPEG", "PNG", "WEBP"}

MAX_SOCIAL_IMAGE_FILE_SIZE = 5 * 1024 * 1024
MIN_SOCIAL_IMAGE_WIDTH = 1200
MIN_SOCIAL_IMAGE_HEIGHT = 630
MAX_SOCIAL_IMAGE_PIXELS = 30_000_000
ALLOWED_SOCIAL_IMAGE_FORMATS = {"JPEG", "PNG", "WEBP"}


def _inspect_image(uploaded_file, *, max_pixels, error_message):
    """Return format and EXIF-corrected dimensions for a safe still image."""
    try:
        uploaded_file.seek(0)
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(uploaded_file) as image:
                image_format = image.format
                width, height = image.size
                if width * height > max_pixels:
                    raise ValidationError(
                        "The image dimensions are too large."
                    )
                if getattr(image, "n_frames", 1) > 1:
                    raise ValidationError(
                        "Animated images are not supported. "
                        "Please upload a still image."
                    )

                oriented = ImageOps.exif_transpose(image)
                try:
                    oriented.load()
                    width, height = oriented.size
                finally:
                    if oriented is not image:
                        oriented.close()

        return image_format, width, height
    except ValidationError:
        raise
    except (
        Image.DecompressionBombError,
        Image.DecompressionBombWarning,
        UnidentifiedImageError,
        OSError,
        SyntaxError,
        ValueError,
    ) as error:
        raise ValidationError(error_message) from error
    finally:
        try:
            uploaded_file.seek(0)
        except (AttributeError, OSError, ValueError):
            pass


def validate_logo(uploaded_file):
    if uploaded_file.size > MAX_LOGO_FILE_SIZE:
        raise ValidationError("The logo must be 2 MB or smaller.")

    image_format, width, height = _inspect_image(
        uploaded_file,
        max_pixels=MAX_LOGO_PIXELS,
        error_message="Upload a valid PNG, JPEG, or WebP image.",
    )
    if image_format not in ALLOWED_LOGO_FORMATS:
        raise ValidationError(
            "The logo must be a PNG, JPEG, or WebP image."
        )

    longest_side = max(width, height)
    shortest_side = min(width, height)
    if longest_side < MIN_LOGO_LONG_SIDE:
        raise ValidationError(
            "The logo's longest side must be at least 600 pixels."
        )
    if shortest_side < MIN_LOGO_SHORT_SIDE:
        raise ValidationError(
            "The logo's shortest side must be at least 100 pixels."
        )
    if longest_side / shortest_side > MAX_LOGO_ASPECT_RATIO:
        raise ValidationError(
            "The logo is too narrow or stretched. Use an aspect ratio "
            "of 10:1 or less."
        )


def validate_favicon(uploaded_file):
    if uploaded_file.size > MAX_FAVICON_FILE_SIZE:
        raise ValidationError(
            "The favicon image must be 1 MB or smaller."
        )

    image_format, width, height = _inspect_image(
        uploaded_file,
        max_pixels=MAX_FAVICON_PIXELS,
        error_message="Upload a valid PNG, JPEG, or WebP image.",
    )
    if image_format not in ALLOWED_FAVICON_FORMATS:
        raise ValidationError(
            "The favicon image must be a PNG, JPEG, or WebP image."
        )
    if width != height:
        raise ValidationError("The favicon image must be square.")
    if width < MIN_FAVICON_SIZE:
        raise ValidationError(
            "The favicon image must be at least 192 × 192 pixels."
        )
    if width > MAX_FAVICON_SIZE:
        raise ValidationError(
            "The favicon image must be no larger than 2048 × 2048 pixels."
        )


def validate_social_image(uploaded_file):
    if uploaded_file.size > MAX_SOCIAL_IMAGE_FILE_SIZE:
        raise ValidationError(
            "The social image must be 5 MB or smaller."
        )

    image_format, width, height = _inspect_image(
        uploaded_file,
        max_pixels=MAX_SOCIAL_IMAGE_PIXELS,
        error_message="Upload a valid PNG, JPEG, or WebP image.",
    )
    if image_format not in ALLOWED_SOCIAL_IMAGE_FORMATS:
        raise ValidationError(
            "The social image must be a PNG, JPEG, or WebP image."
        )
    if width < MIN_SOCIAL_IMAGE_WIDTH:
        raise ValidationError(
            "The social image must be at least 1200 pixels wide."
        )
    if height < MIN_SOCIAL_IMAGE_HEIGHT:
        raise ValidationError(
            "The social image must be at least 630 pixels tall."
        )