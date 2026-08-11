import warnings
from pathlib import Path, PurePosixPath
from zipfile import BadZipFile, ZipFile

from django.core.exceptions import ValidationError
from PIL import Image, UnidentifiedImageError
from pillow_heif import register_heif_opener


register_heif_opener()

MAX_PHOTO_SIZE = 10 * 1024 * 1024
MAX_PHOTO_PIXELS = 50_000_000
MAX_RESUME_SIZE = 10 * 1024 * 1024

PHOTO_FORMATS_BY_EXTENSION = {
    ".jpg": {"JPEG"},
    ".jpeg": {"JPEG"},
    ".png": {"PNG"},
    ".heic": {"HEIF"},
    ".heif": {"HEIF"},
}

OLE_COMPOUND_FILE_SIGNATURE = b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"
MAX_DOCX_ENTRIES = 1_000
MAX_DOCX_UNCOMPRESSED_SIZE = 50 * 1024 * 1024
MAX_DOCX_COMPRESSION_RATIO = 500


def _remember_position(uploaded_file):
    try:
        return uploaded_file.tell()
    except (AttributeError, OSError):
        return 0


def _restore_position(uploaded_file, position):
    try:
        uploaded_file.seek(position)
    except (AttributeError, OSError):
        pass


def validate_quote_photo(uploaded_file):
    """Validate a quote photo by its bytes, not its reported MIME type."""

    display_name = Path(uploaded_file.name).name
    extension = Path(uploaded_file.name).suffix.lower()
    allowed_formats = PHOTO_FORMATS_BY_EXTENSION.get(extension)

    if allowed_formats is None:
        raise ValidationError(
            f"{display_name}: upload a JPG, PNG, HEIC, or HEIF file."
        )

    if uploaded_file.size == 0:
        raise ValidationError(f"{display_name}: the photo file is empty.")

    if uploaded_file.size > MAX_PHOTO_SIZE:
        raise ValidationError(
            f"{display_name}: each photo must be 10 MB or smaller."
        )

    original_position = _remember_position(uploaded_file)

    try:
        uploaded_file.seek(0)

        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)

            with Image.open(uploaded_file) as image:
                actual_format = (image.format or "").upper()

                if actual_format not in allowed_formats:
                    raise ValidationError(
                        f"{display_name}: the file contents do not match "
                        "the filename extension."
                    )

                width, height = image.size

                if width <= 0 or height <= 0:
                    raise ValidationError(
                        f"{display_name}: the image has invalid dimensions."
                    )

                if width * height > MAX_PHOTO_PIXELS:
                    raise ValidationError(
                        f"{display_name}: the image must contain no more "
                        "than 50 megapixels."
                    )

                image.load()
    except ValidationError:
        raise
    except (Image.DecompressionBombError, Image.DecompressionBombWarning) as exc:
        raise ValidationError(
            f"{display_name}: the image dimensions are too large."
        ) from exc
    except (UnidentifiedImageError, OSError, SyntaxError, ValueError) as exc:
        raise ValidationError(
            f"{display_name}: the file is not a valid, readable image."
        ) from exc
    finally:
        _restore_position(uploaded_file, original_position)


def validate_resume_size(uploaded_file):
    if uploaded_file.size == 0:
        raise ValidationError("The resume file is empty.")

    if uploaded_file.size > MAX_RESUME_SIZE:
        raise ValidationError("The resume must be 10 MB or smaller.")


def _validate_docx_archive(uploaded_file):
    try:
        with ZipFile(uploaded_file) as archive:
            entries = archive.infolist()

            if len(entries) > MAX_DOCX_ENTRIES:
                return False

            names = {entry.filename for entry in entries}

            if not {
                "[Content_Types].xml",
                "word/document.xml",
            }.issubset(names):
                return False

            total_uncompressed = 0

            for entry in entries:
                path = PurePosixPath(entry.filename)

                if path.is_absolute() or ".." in path.parts:
                    return False

                if entry.flag_bits & 0x1:
                    return False

                total_uncompressed += entry.file_size

                if total_uncompressed > MAX_DOCX_UNCOMPRESSED_SIZE:
                    return False

                if entry.file_size:
                    compressed_size = max(entry.compress_size, 1)

                    if (
                        entry.file_size / compressed_size
                        > MAX_DOCX_COMPRESSION_RATIO
                    ):
                        return False
    except (BadZipFile, OSError, ValueError):
        return False

    return True


def validate_resume_contents(uploaded_file):
    """Confirm that the uploaded bytes safely match PDF, DOC, or DOCX."""

    extension = Path(uploaded_file.name).suffix.lower()
    original_position = _remember_position(uploaded_file)

    try:
        uploaded_file.seek(0)
        header = uploaded_file.read(8)

        if extension == ".pdf":
            is_valid = header.startswith(b"%PDF-")
        elif extension == ".doc":
            is_valid = header == OLE_COMPOUND_FILE_SIGNATURE
        elif extension == ".docx":
            uploaded_file.seek(0)
            is_valid = _validate_docx_archive(uploaded_file)
        else:
            is_valid = False
    finally:
        _restore_position(uploaded_file, original_position)

    if not is_valid:
        raise ValidationError("Upload a valid PDF, DOC, or DOCX resume.")


def validate_consent_is_accepted(value):
    if value is not True:
        raise ValidationError(
            "You must agree before submitting an application."
        )
