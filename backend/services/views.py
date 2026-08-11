from django.db.models import Prefetch
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from .models import Service, ServiceIncludedItem
from .serializers import ServiceNameSerializer, ServiceSerializer


class ServiceNameListView(ListAPIView):
    serializer_class = ServiceNameSerializer
    permission_classes = (AllowAny,)
    pagination_class = None

    def get_queryset(self):
        return (
            Service.objects.filter(is_active=True)
            .only("name", "slug", "display_order")
            .order_by("display_order", "name")
        )


class ServiceListView(ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = (AllowAny,)
    pagination_class = None

    def get_queryset(self):
        included_items = ServiceIncludedItem.objects.order_by(
            "display_order",
            "id",
        )

        return (
            Service.objects.filter(is_active=True)
            .select_related("category")
            .prefetch_related(
                Prefetch(
                    "included_items",
                    queryset=included_items,
                )
            )
            .order_by("display_order", "name")
        )