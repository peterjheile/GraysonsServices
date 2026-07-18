from django.urls import path

from .views import SiteSettingsView, CompanyStatsView


urlpatterns = [
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