from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny

from .models import JobPosting
from .serializers import JobPostingSerializer


def public_job_postings():
    return (
        JobPosting.objects.filter(
            status=JobPosting.Status.OPEN,
            category__is_active=True,
        )
        .select_related("category")
        .prefetch_related(
            "responsibilities",
            "requirements",
            "nice_to_haves",
        )
    )


class JobPostingListView(ListAPIView):
    serializer_class = JobPostingSerializer
    permission_classes = (AllowAny,)
    pagination_class = None

    def get_queryset(self):
        return public_job_postings()


class JobPostingDetailView(RetrieveAPIView):
    serializer_class = JobPostingSerializer
    permission_classes = (AllowAny,)
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    def get_queryset(self):
        return public_job_postings()