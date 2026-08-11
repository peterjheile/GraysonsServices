from rest_framework import serializers

from .models import JobCategory, JobPosting


class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = (
            "name",
            "slug",
        )
        read_only_fields = fields


class OrderedJobItemSerializer(serializers.Serializer):
    text = serializers.CharField(read_only=True)


class JobPostingSerializer(serializers.ModelSerializer):
    category = JobCategorySerializer(read_only=True)
    seniority_label = serializers.CharField(
        source="get_seniority_display",
        read_only=True,
    )
    employment_type_label = serializers.CharField(
        source="get_employment_type_display",
        read_only=True,
    )
    posted_at = serializers.DateField(
        format="%Y-%m-%d",
        read_only=True,
    )
    pay_min = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=True,
        allow_null=True,
        read_only=True,
    )
    pay_max = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=True,
        allow_null=True,
        read_only=True,
    )
    pay_unit_label = serializers.CharField(
        source="get_pay_unit_display",
        read_only=True,
    )
    responsibilities = OrderedJobItemSerializer(
        many=True,
        read_only=True,
    )
    requirements = OrderedJobItemSerializer(
        many=True,
        read_only=True,
    )
    nice_to_haves = OrderedJobItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = JobPosting
        fields = (
            "slug",
            "title",
            "location",
            "category",
            "seniority",
            "seniority_label",
            "employment_type",
            "employment_type_label",
            "is_urgent",
            "posted_at",
            "pay_min",
            "pay_max",
            "pay_unit",
            "pay_unit_label",
            "description",
            "responsibilities",
            "requirements",
            "nice_to_haves",
        )
        read_only_fields = fields