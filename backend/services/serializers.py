from rest_framework import serializers

from .models import Service


class ServiceNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = (
            "name",
            "slug",
        )
        read_only_fields = fields