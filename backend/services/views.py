from rest_framework.generics import ListAPIView

from .models import Service
from .serializers import ServiceNameSerializer


class ServiceNameListView(ListAPIView):
    serializer_class = ServiceNameSerializer

    def get_queryset(self):
        return Service.objects.filter(
            is_active=True,
        ).order_by(
            "display_order",
            "name",
        )