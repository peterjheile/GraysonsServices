from pathlib import Path

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.files.storage import FileSystemStorage
from django.utils.deconstruct import deconstructible


@deconstructible
class PrivateMediaStorage(FileSystemStorage):
    """Local storage for files that must never receive a public URL."""

    def __init__(self, *args, **kwargs):
        private_root_setting = getattr(
            settings,
            "PRIVATE_MEDIA_ROOT",
            None,
        )

        if not private_root_setting:
            raise ImproperlyConfigured(
                "PRIVATE_MEDIA_ROOT must be configured for private uploads."
            )

        private_root = Path(private_root_setting).resolve()
        public_root_setting = getattr(settings, "MEDIA_ROOT", None)

        if public_root_setting:
            public_root = Path(public_root_setting).resolve()

            try:
                private_root.relative_to(public_root)
            except ValueError:
                pass
            else:
                raise ImproperlyConfigured(
                    "PRIVATE_MEDIA_ROOT must not be MEDIA_ROOT or a directory "
                    "inside MEDIA_ROOT."
                )

        kwargs.setdefault("location", private_root)
        kwargs.setdefault("base_url", "/__private_media_not_public__/")
        kwargs.setdefault("file_permissions_mode", 0o600)
        kwargs.setdefault("directory_permissions_mode", 0o700)

        super().__init__(*args, **kwargs)

    def url(self, name):
        raise NotImplementedError(
            "Private files do not have public URLs."
        )


private_media_storage = PrivateMediaStorage()
