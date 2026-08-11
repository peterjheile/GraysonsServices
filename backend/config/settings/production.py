from urllib.parse import urlsplit

from django.core.exceptions import ImproperlyConfigured

from .base import *


_PLACEHOLDER_VALUES = {
    "changeme",
    "change-me",
    "redacted",
    "replace-me",
    "replace-with-a-real-value",
}


def _required(name, *, min_length=1):
    value = env(name, default="").strip()
    normalized = value.lower()

    if (
        len(value) < min_length
        or normalized in _PLACEHOLDER_VALUES
        or normalized.startswith("replace-")
        or "example.com" in normalized
    ):
        raise ImproperlyConfigured(
            f"{name} must be set to a real production value."
        )

    return value


def _csv(name, *, required=True):
    values = [
        item.strip()
        for item in env(name, default="").split(",")
        if item.strip()
    ]

    if required and not values:
        raise ImproperlyConfigured(
            f"{name} must contain at least one comma-separated value."
        )

    if any(
        value.lower().startswith("replace-")
        or "example.com" in value.lower()
        for value in values
    ):
        raise ImproperlyConfigured(
            f"{name} still contains an example or placeholder value."
        )

    return values


def _https_origins(name):
    origins = _csv(name)

    for origin in origins:
        parsed = urlsplit(origin)

        if (
            parsed.scheme != "https"
            or not parsed.netloc
            or parsed.path not in ("", "/")
            or parsed.query
            or parsed.fragment
        ):
            raise ImproperlyConfigured(
                f"{name} entries must be HTTPS origins without paths: "
                f"{origin!r}."
            )

    return [origin.rstrip("/") for origin in origins]


def _https_url_prefix(name):
    value = _required(name)
    parsed = urlsplit(value)

    if (
        parsed.scheme != "https"
        or not parsed.netloc
        or not parsed.path.startswith("/")
        or not parsed.path.endswith("/")
        or parsed.query
        or parsed.fragment
    ):
        raise ImproperlyConfigured(
            f"{name} must be an HTTPS URL ending with '/': {value!r}."
        )

    return value


def _nonnegative_int(name, *, default):
    value = env(name, default=default, cast=int)

    if value < 0:
        raise ImproperlyConfigured(f"{name} cannot be negative.")

    return value


SECRET_KEY = _required("SECRET_KEY", min_length=50)
DEBUG = False

ALLOWED_HOSTS = _csv("ALLOWED_HOSTS")

for host in ALLOWED_HOSTS:
    if "://" in host or "/" in host:
        raise ImproperlyConfigured(
            "ALLOWED_HOSTS entries must be hostnames or IP addresses "
            f"without a scheme, path, or port: {host!r}."
        )

CORS_ALLOWED_ORIGINS = _https_origins("CORS_ALLOWED_ORIGINS")
CSRF_TRUSTED_ORIGINS = _https_origins("CSRF_TRUSTED_ORIGINS")

MEDIA_URL = _https_url_prefix("MEDIA_URL")

media_hostname = urlsplit(MEDIA_URL).hostname
if media_hostname not in ALLOWED_HOSTS:
    raise ImproperlyConfigured(
        "The MEDIA_URL hostname must be present in ALLOWED_HOSTS."
    )


database_port = env("DB_PORT", default=5432, cast=int)

if not 1 <= database_port <= 65_535:
    raise ImproperlyConfigured("DB_PORT must be between 1 and 65535.")

database_sslmode = env("DB_SSLMODE", default="prefer").strip().lower()
valid_ssl_modes = {
    "disable",
    "allow",
    "prefer",
    "require",
    "verify-ca",
    "verify-full",
}

if database_sslmode not in valid_ssl_modes:
    raise ImproperlyConfigured(
        "DB_SSLMODE must be one of: "
        + ", ".join(sorted(valid_ssl_modes))
        + "."
    )

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": _required("DB_NAME"),
        "USER": _required("DB_USER"),
        "PASSWORD": _required("DB_PASSWORD"),
        "HOST": _required("DB_HOST"),
        "PORT": database_port,
        "CONN_MAX_AGE": _nonnegative_int(
            "DB_CONN_MAX_AGE",
            default=60,
        ),
        "CONN_HEALTH_CHECKS": True,
        "OPTIONS": {
            "sslmode": database_sslmode,
        },
    },
}


STORAGES = {
    **STORAGES,
    "staticfiles": {
        "BACKEND": (
            "whitenoise.storage."
            "CompressedManifestStaticFilesStorage"
        ),
    },
}


CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.filebased.FileBasedCache",
        "LOCATION": env(
            "DJANGO_CACHE_LOCATION",
            default=str(BASE_DIR / ".cache" / "django"),
        ),
        "OPTIONS": {
            "MAX_ENTRIES": 10_000,
            "CULL_FREQUENCY": 3,
        },
    },
}


REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    "NUM_PROXIES": _nonnegative_int(
        "DRF_NUM_PROXIES",
        default=2,
    ),
    "DEFAULT_THROTTLE_RATES": {
        "contact_submission_burst": env(
            "CONTACT_SUBMISSION_BURST_RATE",
            default="3/minute",
        ),
        "contact_submission_daily": env(
            "CONTACT_SUBMISSION_DAILY_RATE",
            default="5/day",
        ),
        "quote_request_burst": env(
            "QUOTE_REQUEST_BURST_RATE",
            default="3/minute",
        ),
        "quote_request_daily": env(
            "QUOTE_REQUEST_DAILY_RATE",
            default="5/day",
        ),
        "job_application_burst": env(
            "JOB_APPLICATION_BURST_RATE",
            default="3/minute",
        ),
        "job_application_daily": env(
            "JOB_APPLICATION_DAILY_RATE",
            default="5/day",
        ),
    },
}


EMAIL_BACKEND = "anymail.backends.resend.EmailBackend"
EMAIL_TIMEOUT = _nonnegative_int("EMAIL_TIMEOUT", default=10)

ANYMAIL = {
    "RESEND_API_KEY": _required("RESEND_API_KEY"),
}

DEFAULT_FROM_EMAIL = _required("DEFAULT_FROM_EMAIL")
CONTACT_NOTIFICATION_EMAIL = _required("CONTACT_NOTIFICATION_EMAIL")
QUOTE_NOTIFICATION_EMAIL = _required("QUOTE_NOTIFICATION_EMAIL")
CAREERS_NOTIFICATION_EMAIL = _required("CAREERS_NOTIFICATION_EMAIL")


SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = env(
    "SECURE_SSL_REDIRECT",
    default=True,
    cast=bool,
)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = _nonnegative_int(
    "SECURE_HSTS_SECONDS",
    default=3600,
)
SECURE_HSTS_INCLUDE_SUBDOMAINS = env(
    "SECURE_HSTS_INCLUDE_SUBDOMAINS",
    default=False,
    cast=bool,
)
SECURE_HSTS_PRELOAD = env(
    "SECURE_HSTS_PRELOAD",
    default=False,
    cast=bool,
)
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
X_FRAME_OPTIONS = "DENY"