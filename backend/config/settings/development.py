from django.core.exceptions import ImproperlyConfigured

from .base import *


SECRET_KEY = env(
    "SECRET_KEY",
    default="django-insecure-development-only-key-not-for-production",
)
DEBUG = env("DEBUG", default=True, cast=bool)

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": Path(
            env("SQLITE_PATH", default=str(BASE_DIR / "db.sqlite3"))
        ),
    },
}


CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "graysons-services-development",
    },
}


REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ),
    "NUM_PROXIES": 0,
    "DEFAULT_THROTTLE_RATES": {
        "contact_submission_burst": "10/minute",
        "contact_submission_daily": "100/day",
        "quote_request_burst": "10/minute",
        "quote_request_daily": "100/day",
        "job_application_burst": "10/minute",
        "job_application_daily": "100/day",
    },
}


SEND_REAL_EMAILS = env(
    "SEND_REAL_EMAILS",
    default=False,
    cast=bool,
)

EMAIL_BACKEND = (
    "anymail.backends.resend.EmailBackend"
    if SEND_REAL_EMAILS
    else "django.core.mail.backends.console.EmailBackend"
)

ANYMAIL = {
    "RESEND_API_KEY": env("RESEND_API_KEY", default="").strip(),
}

DEFAULT_FROM_EMAIL = env(
    "DEFAULT_FROM_EMAIL",
    default="Grayson's Services <webmaster@localhost>",
).strip()
CONTACT_NOTIFICATION_EMAIL = env(
    "CONTACT_NOTIFICATION_EMAIL",
    default="",
).strip()
QUOTE_NOTIFICATION_EMAIL = env(
    "QUOTE_NOTIFICATION_EMAIL",
    default="",
).strip()
CAREERS_NOTIFICATION_EMAIL = env(
    "CAREERS_NOTIFICATION_EMAIL",
    default="",
).strip()

if SEND_REAL_EMAILS:
    required_email_settings = {
        "RESEND_API_KEY": ANYMAIL["RESEND_API_KEY"],
        "DEFAULT_FROM_EMAIL": DEFAULT_FROM_EMAIL,
        "CONTACT_NOTIFICATION_EMAIL": CONTACT_NOTIFICATION_EMAIL,
        "QUOTE_NOTIFICATION_EMAIL": QUOTE_NOTIFICATION_EMAIL,
        "CAREERS_NOTIFICATION_EMAIL": CAREERS_NOTIFICATION_EMAIL,
    }
    missing_email_settings = [
        name
        for name, value in required_email_settings.items()
        if not value or value.lower() == "redacted" or "example.com" in value
    ]

    if missing_email_settings:
        raise ImproperlyConfigured(
            "SEND_REAL_EMAILS=True requires real values for: "
            + ", ".join(missing_email_settings)
            + "."
        )
