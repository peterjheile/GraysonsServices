from rest_framework import generics

from .models import SiteSettings, CompanyStats
from .serializers import SiteSettingsSerializer, CompanyStatsSerializer


class SiteSettingsView(generics.RetrieveAPIView):
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        return SiteSettings.objects.first()
    
class CompanyStatsView(generics.RetrieveAPIView):
    serializer_class = CompanyStatsSerializer

    def get_object(self):
        return CompanyStats.objects.first()