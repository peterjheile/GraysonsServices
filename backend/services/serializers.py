from rest_framework import serializers

from .models import (
    Service,
    ServiceCategory,
    ServiceIncludedItem,
)


class ServiceNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = (
            "name",
            "slug",
        )


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = (
            "name",
            "slug",
        )


class ServiceIncludedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceIncludedItem
        fields = (
            "text",
        )


class ServiceSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)
    included_items = ServiceIncludedItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Service
        fields = (
            "name",
            "slug",
            "category",
            "subtitle",
            "overview",
            "process_description",
            "primary_image",
            "primary_image_alt",
            "supporting_image_one",
            "supporting_image_one_alt",
            "supporting_image_two",
            "supporting_image_two_alt",
            "included_items",
        )