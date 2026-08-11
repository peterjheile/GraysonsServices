from django.urls import path

from .health import healthcheck
from .views import CompanyStatsView, SiteSettingsView


urlpatterns = [
    path(
        "health/",
        healthcheck,
        name="healthcheck",
    ),
    path(
        "site-settings/",
        SiteSettingsView.as_view(),
        name="site-settings",
    ),
    path(
        "company-stats/",
        CompanyStatsView.as_view(),
        name="company-stats",
    ),
]