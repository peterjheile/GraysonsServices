from rest_framework import serializers

from .models import BusinessHours, SiteSettings, CompanyStats


class BusinessHoursSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(
        source="get_day_display",
        read_only=True,
    )

    class Meta:
        model = BusinessHours
        fields = (
            "day",
            "day_name",
            "opening_time",
            "closing_time",
            "is_closed",
        )
        read_only_fields = fields


class SiteSettingsSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    favicon_url = serializers.SerializerMethodField()
    social_image_url = serializers.SerializerMethodField()
    business_hours = BusinessHoursSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = SiteSettings
        fields = (
            "business_name",
            "tagline",
            "logo_url",
            "favicon_url",
            "phone",
            "email",
            "address_line_1",
            "address_line_2",
            "city",
            "state",
            "zip_code",
            "service_area",
            "facebook_url",
            "instagram_url",
            "google_business_url",
            "linkedin_url",
            "seo_title",
            "seo_description",
            "social_image_url",
            "business_hours",
            "updated_at",
        )
        read_only_fields = fields

    def _get_image_url(self, image_field):
        if not image_field:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(image_field.url)

        return image_field.url

    def get_logo_url(self, obj):
        logo = obj.optimized_logo or obj.logo
        return self._get_image_url(logo)

    def get_favicon_url(self, obj):
        favicon = obj.optimized_favicon or obj.favicon
        return self._get_image_url(favicon)

    def get_social_image_url(self, obj):
        social_image = (
            obj.optimized_social_image or obj.social_image
        )

        return self._get_image_url(social_image)
    



class CompanyStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyStats
        fields = (
            "years_in_business",
            "projects_completed",
            "client_satisfaction",
            "updated_at",
        )
        read_only_fields = fields