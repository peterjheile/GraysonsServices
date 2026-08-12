from pathlib import Path

from decouple import AutoConfig
from django.templatetags.static import static


BASE_DIR = Path(__file__).resolve().parent.parent.parent
env = AutoConfig(search_path=BASE_DIR)


def _path_setting(name, default):
    value = env(name, default="").strip()
    return Path(value) if value else Path(default)


# Environment-specific settings override these safe base values.
SECRET_KEY = ""
DEBUG = False
ALLOWED_HOSTS: list[str] = []


DJANGO_APPS = [
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    "unfold.contrib.inlines",
    "unfold.contrib.import_export",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "corsheaders",
    "anymail",
]

LOCAL_APPS = [
    "core",
    "services",
    "projects",
    "reviews",
    "contact",
    "careers",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "MinimumLengthValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator"
        ),
    },
]


LANGUAGE_CODE = "en-us"
TIME_ZONE = "America/Indiana/Indianapolis"
USE_I18N = True
USE_TZ = True


STATIC_URL = "/static/"
STATIC_ROOT = _path_setting(
    "STATIC_ROOT",
    BASE_DIR / "staticfiles",
)
STATICFILES_DIRS = [
    BASE_DIR / "static",
]

MEDIA_URL = "/media/"
MEDIA_ROOT = _path_setting(
    "MEDIA_ROOT",
    BASE_DIR / "media",
)
PRIVATE_MEDIA_ROOT = _path_setting(
    "PRIVATE_MEDIA_ROOT",
    BASE_DIR / "private_media",
)

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


REST_FRAMEWORK = {
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",
        "rest_framework.parsers.FormParser",
    ],
}


UNFOLD = {
    # Keep your existing Unfold settings...

    "SITE_TITLE": "Grayson’s Services Administration",
    "SITE_HEADER": "Grayson’s Services",
    "SITE_SUBHEADER": "Website Administration",
    "SITE_URL": "https://graysonsservices.com",

    "SITE_LOGO": lambda request: static(
        "admin-branding/logo.png"
    ),
    "SITE_ICON": lambda request: static(
        "admin-branding/icon.png"
    ),
    "SITE_FAVICONS": [
        {
            "rel": "icon",
            "sizes": "32x32",
            "type": "image/png",
            "href": lambda request: static(
                "admin-branding/favicon.png"
            ),
        },
    ],

    "COLORS": {
        "base": {
            "50": "#fafaf9",
            "100": "#f5f5f4",
            "200": "#e7e5e4",
            "300": "#d6d3d1",
            "400": "#a8a29e",
            "500": "#78716c",
            "600": "#57534e",
            "700": "#44403c",
            "800": "#292524",
            "900": "#1c1917",
            "950": "#0c0a09",
        },
        "primary": {
            "50": "#faf8f3",
            "100": "#f4efe3",
            "200": "#e9ddc5",
            "300": "#dcc79f",
            "400": "#c9aa73",
            "500": "#b8975a",
            "600": "#967641",
            "700": "#765c35",
            "800": "#604b30",
            "900": "#513f2b",
            "950": "#2d2116",
        },
    },

    "BORDER_RADIUS": "4px",
}


# Development and production supply their own email values.
ANYMAIL = {
    "RESEND_API_KEY": "",
}
DEFAULT_FROM_EMAIL = "webmaster@localhost"
CONTACT_NOTIFICATION_EMAIL = ""
QUOTE_NOTIFICATION_EMAIL = ""
CAREERS_NOTIFICATION_EMAIL = ""
EMAIL_TIMEOUT = 10