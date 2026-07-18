from django.urls import path

from .views import ServiceNameListView


app_name = "services"

urlpatterns = [
    path(
        "services/names/",
        ServiceNameListView.as_view(),
        name="service-name-list",
    ),
]