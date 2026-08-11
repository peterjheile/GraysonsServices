from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import CompanyStats, SiteSettings
from .serializers import CompanyStatsSerializer, SiteSettingsSerializer


class SiteSettingsView(generics.RetrieveAPIView):
    serializer_class = SiteSettingsSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        obj = get_object_or_404(
            SiteSettings.objects.prefetch_related("business_hours")
        )
        self.check_object_permissions(self.request, obj)
        return obj


class CompanyStatsView(generics.RetrieveAPIView):
    serializer_class = CompanyStatsSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        obj = get_object_or_404(CompanyStats.objects.all())
        self.check_object_permissions(self.request, obj)
        return obj