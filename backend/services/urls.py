from django.urls import path

from .views import ServiceListView, ServiceNameListView


app_name = "services"

urlpatterns = [
    path(
        "services/",
        ServiceListView.as_view(),
        name="service-list",
    ),
    path(
        "services/names/",
        ServiceNameListView.as_view(),
        name="service-name-list",
    ),
]