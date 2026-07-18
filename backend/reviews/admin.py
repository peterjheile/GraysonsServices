from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin

from .models import Review


@admin.register(Review)
class ReviewAdmin(ModelAdmin):
    list_display = (
        "profile_preview",
        "reviewer_name",
        "rating_display",
        "source",
        "category",
        "project",
        "review_date_display",
        "show_on_homepage",
        "is_featured",
        "is_active",
        "homepage_order",
        "display_order",
    )

    list_display_links = (
        "profile_preview",
        "reviewer_name",
    )

    list_editable = (
        "show_on_homepage",
        "is_featured",
        "is_active",
        "homepage_order",
        "display_order",
    )

    list_filter = (
        "is_active",
        "show_on_homepage",
        "is_featured",
        "source",
        "rating",
        "category",
        "review_year",
    )

    search_fields = (
        "reviewer_name",
        "role",
        "quote",
        "project__title",
        "category__name",
    )

    autocomplete_fields = (
        "category",
        "project",
    )

    readonly_fields = (
        "large_profile_preview",
        "created_at",
        "updated_at",
    )

    ordering = (
        "-show_on_homepage",
        "-is_featured",
        "homepage_order",
        "display_order",
        "-review_year",
        "-review_month",
    )

    list_select_related = (
        "category",
        "project",
    )

    list_per_page = 25

    fieldsets = (
        (
            "Reviewer",
            {
                "fields": (
                    "reviewer_name",
                    "role",
                    "profile_image",
                    "large_profile_preview",
                ),
            },
        ),
        (
            "Review",
            {
                "fields": (
                    "quote",
                    "rating",
                    "source",
                ),
            },
        ),
        (
            "Review Context",
            {
                "description": (
                    "A project and category are optional for regular "
                    "reviews. Featured reviews must be connected to a "
                    "project. When a project is selected without a "
                    "category, the project's category is assigned "
                    "automatically."
                ),
                "fields": (
                    "category",
                    "project",
                    "review_month",
                    "review_year",
                ),
            },
        ),
        (
            "Website Display",
            {
                "description": (
                    "Homepage selection and featured status are separate. "
                    "A regular or featured review can be selected for the "
                    "homepage. Featured reviews require a project."
                ),
                "fields": (
                    "is_active",
                    "show_on_homepage",
                    "is_featured",
                    "homepage_order",
                    "display_order",
                ),
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
    )

    @admin.display(description="Profile")
    def profile_preview(self, obj):
        if not obj.profile_image:
            initials = obj.initials or "—"

            return format_html(
                """
                <span
                    style="
                        align-items: center;
                        background: #1a1714;
                        border-radius: 9999px;
                        color: #b8975a;
                        display: inline-flex;
                        font-size: 12px;
                        font-weight: 600;
                        height: 44px;
                        justify-content: center;
                        letter-spacing: 0.08em;
                        width: 44px;
                    "
                >
                    {}
                </span>
                """,
                initials,
            )

        return format_html(
            """
            <img
                src="{}"
                alt="{}"
                style="
                    border-radius: 9999px;
                    height: 44px;
                    object-fit: cover;
                    width: 44px;
                "
            />
            """,
            obj.profile_image.url,
            obj.reviewer_name,
        )

    @admin.display(description="Current Profile Image")
    def large_profile_preview(self, obj):
        if not obj or not obj.profile_image:
            return "No profile image uploaded. Initials will be displayed."

        return format_html(
            """
            <img
                src="{}"
                alt="{}"
                style="
                    border-radius: 9999px;
                    height: 140px;
                    object-fit: cover;
                    width: 140px;
                "
            />
            """,
            obj.profile_image.url,
            obj.reviewer_name,
        )

    @admin.display(
        description="Rating",
        ordering="rating",
    )
    def rating_display(self, obj):
        filled_stars = "★" * obj.rating
        empty_stars = "☆" * (5 - obj.rating)

        return format_html(
            """
            <span
                title="{} out of 5 stars"
                style="
                    color: #b8975a;
                    font-size: 15px;
                    letter-spacing: 2px;
                    white-space: nowrap;
                "
            >
                {}{}
            </span>
            """,
            obj.rating,
            filled_stars,
            empty_stars,
        )

    @admin.display(
        description="Review Date",
        ordering="review_year",
    )
    def review_date_display(self, obj):
        return (
            f"{obj.get_review_month_display()} "
            f"{obj.review_year}"
        )

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related(
                "category",
                "project",
            )
        )