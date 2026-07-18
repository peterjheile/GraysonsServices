from io import BytesIO
from pathlib import Path

from django.core.files.base import ContentFile
from PIL import Image, ImageOps


LOGO_MAX_LONG_SIDE = 1000
FAVICON_SIZE = 192
SOCIAL_IMAGE_SIZE = (1200, 630)


def create_optimized_logo(uploaded_file) -> ContentFile:
    uploaded_file.open("rb")

    with Image.open(uploaded_file) as image:
        image = ImageOps.exif_transpose(image)

        # Preserve transparency when present.
        if image.mode in ("RGBA", "LA") or (
            image.mode == "P" and "transparency" in image.info
        ):
            image = image.convert("RGBA")
        else:
            image = image.convert("RGB")

        width, height = image.size
        longest_side = max(width, height)

        # Do not enlarge smaller images.
        if longest_side > LOGO_MAX_LONG_SIDE:
            scale = LOGO_MAX_LONG_SIDE / longest_side

            new_size = (
                round(width * scale),
                round(height * scale),
            )

            image = image.resize(
                new_size,
                Image.Resampling.LANCZOS,
            )

        output = BytesIO()

        image.save(
            output,
            format="WEBP",
            lossless=True,
            method=6,
        )

    uploaded_file.seek(0)
    output.seek(0)

    original_stem = Path(uploaded_file.name).stem
    filename = f"{original_stem}-optimized.webp"

    return ContentFile(
        output.read(),
        name=filename,
    )


def create_optimized_favicon(uploaded_file) -> ContentFile:
    uploaded_file.open("rb")

    with Image.open(uploaded_file) as image:
        image = ImageOps.exif_transpose(image)

        # PNG supports transparency, so use RGBA consistently.
        image = image.convert("RGBA")

        image = image.resize(
            (FAVICON_SIZE, FAVICON_SIZE),
            Image.Resampling.LANCZOS,
        )

        output = BytesIO()

        image.save(
            output,
            format="PNG",
            optimize=True,
        )

    uploaded_file.seek(0)
    output.seek(0)

    original_stem = Path(uploaded_file.name).stem
    filename = f"{original_stem}-favicon.png"

    return ContentFile(
        output.read(),
        name=filename,
    )



def create_optimized_social_image(uploaded_file) -> ContentFile:
    uploaded_file.open("rb")

    with Image.open(uploaded_file) as image:
        image = ImageOps.exif_transpose(image)

        # JPEG does not support transparency. Place transparent areas
        # over a white background.
        if image.mode in ("RGBA", "LA") or (
            image.mode == "P" and "transparency" in image.info
        ):
            image = image.convert("RGBA")

            background = Image.new(
                "RGB",
                image.size,
                color="white",
            )

            background.paste(
                image,
                mask=image.getchannel("A"),
            )

            image = background
        else:
            image = image.convert("RGB")

        # Center-crop to the correct aspect ratio and resize without
        # stretching the image.
        image = ImageOps.fit(
            image,
            SOCIAL_IMAGE_SIZE,
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )

        output = BytesIO()

        image.save(
            output,
            format="JPEG",
            quality=90,
            optimize=True,
            progressive=True,
        )

    uploaded_file.seek(0)
    output.seek(0)

    original_stem = Path(uploaded_file.name).stem
    filename = f"{original_stem}-social.jpg"

    return ContentFile(
        output.read(),
        name=filename,
    )