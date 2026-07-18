from django.core.exceptions import ValidationError
from PIL import Image, UnidentifiedImageError


# Logo requirements
MAX_LOGO_FILE_SIZE = 2 * 1024 * 1024
MAX_LOGO_PIXELS = 20_000_000
MIN_LOGO_LONG_SIDE = 600
MIN_LOGO_SHORT_SIDE = 100
MAX_LOGO_ASPECT_RATIO = 10

ALLOWED_LOGO_FORMATS = {
    "JPEG",
    "PNG",
    "WEBP",
}


# Favicon requirements
MAX_FAVICON_FILE_SIZE = 1 * 1024 * 1024
MIN_FAVICON_SIZE = 192
MAX_FAVICON_SIZE = 2048

ALLOWED_FAVICON_FORMATS = {
    "JPEG",
    "PNG",
    "WEBP",
}

#social link image requirements
MAX_SOCIAL_IMAGE_FILE_SIZE = 5 * 1024 * 1024
MIN_SOCIAL_IMAGE_WIDTH = 1200
MIN_SOCIAL_IMAGE_HEIGHT = 630
MAX_SOCIAL_IMAGE_PIXELS = 30_000_000

ALLOWED_SOCIAL_IMAGE_FORMATS = {
    "JPEG",
    "PNG",
    "WEBP",
}


def validate_logo(uploaded_file) -> None:
    """
    Validate horizontal, square, and vertical raster logos.
    """

    if uploaded_file.size > MAX_LOGO_FILE_SIZE:
        raise ValidationError(
            "The logo must be 2 MB or smaller."
        )

    try:
        uploaded_file.seek(0)

        with Image.open(uploaded_file) as image:
            image_format = image.format
            width, height = image.size
            image.verify()

        uploaded_file.seek(0)

    except (
        UnidentifiedImageError,
        OSError,
        SyntaxError,
        ValueError,
    ) as error:
        uploaded_file.seek(0)

        raise ValidationError(
            "Upload a valid PNG, JPEG, or WebP image."
        ) from error

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

    if width * height > MAX_LOGO_PIXELS:
        raise ValidationError(
            "The logo must be smaller than 20 megapixels."
        )

    aspect_ratio = longest_side / shortest_side

    if aspect_ratio > MAX_LOGO_ASPECT_RATIO:
        raise ValidationError(
            "The logo is too narrow or stretched. Use an aspect ratio "
            "of 10:1 or less."
        )


def validate_favicon(uploaded_file) -> None:
    """
    Validate a square raster image used to generate the favicon.
    """

    if uploaded_file.size > MAX_FAVICON_FILE_SIZE:
        raise ValidationError(
            "The favicon image must be 1 MB or smaller."
        )

    try:
        uploaded_file.seek(0)

        with Image.open(uploaded_file) as image:
            image_format = image.format
            width, height = image.size
            image.verify()

        uploaded_file.seek(0)

    except (
        UnidentifiedImageError,
        OSError,
        SyntaxError,
        ValueError,
    ) as error:
        uploaded_file.seek(0)

        raise ValidationError(
            "Upload a valid PNG, JPEG, or WebP image."
        ) from error

    if image_format not in ALLOWED_FAVICON_FORMATS:
        raise ValidationError(
            "The favicon image must be a PNG, JPEG, or WebP image."
        )

    if width != height:
        raise ValidationError(
            "The favicon image must be square."
        )

    if width < MIN_FAVICON_SIZE:
        raise ValidationError(
            "The favicon image must be at least 192 × 192 pixels."
        )

    if width > MAX_FAVICON_SIZE:
        raise ValidationError(
            "The favicon image must be no larger than "
            "2048 × 2048 pixels."
        )
    


def validate_social_image(uploaded_file) -> None:
    """
    Validate an image used to generate the social sharing image.
    """

    if uploaded_file.size > MAX_SOCIAL_IMAGE_FILE_SIZE:
        raise ValidationError(
            "The social image must be 5 MB or smaller."
        )

    try:
        uploaded_file.seek(0)

        with Image.open(uploaded_file) as image:
            image_format = image.format
            width, height = image.size
            image.verify()

        uploaded_file.seek(0)

    except (
        UnidentifiedImageError,
        OSError,
        SyntaxError,
        ValueError,
    ) as error:
        uploaded_file.seek(0)

        raise ValidationError(
            "Upload a valid PNG, JPEG, or WebP image."
        ) from error

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

    if width * height > MAX_SOCIAL_IMAGE_PIXELS:
        raise ValidationError(
            "The social image must be smaller than 30 megapixels."
        )