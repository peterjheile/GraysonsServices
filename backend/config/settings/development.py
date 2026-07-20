from .base import *


DEBUG = True

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


REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ),
    "DEFAULT_THROTTLE_RATES": {
        "contact_burst": "10/minute",
        "contact_daily": "100/day",
    },
}




SEND_REAL_EMAILS = config(
    "SEND_REAL_EMAILS",
    default=False,
    cast=bool,
)

EMAIL_BACKEND = (
    "anymail.backends.resend.EmailBackend"
    if SEND_REAL_EMAILS
    else "django.core.mail.backends.console.EmailBackend"
)

