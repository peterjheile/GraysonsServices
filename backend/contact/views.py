import logging

from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny

from .models import ContactSubmission
from .serializers import ContactSubmissionSerializer
from .services import send_contact_notification
from .throttles import (
    ContactBurstThrottle,
    ContactDailyThrottle,
)


logger = logging.getLogger(__name__)


class ContactSubmissionCreateView(CreateAPIView):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    permission_classes = (AllowAny,)
    throttle_classes = (
        ContactBurstThrottle,
        ContactDailyThrottle,
    )

    def perform_create(self, serializer):
        submission = serializer.save()

        try:
            send_contact_notification(submission)
        except Exception:
            logger.exception(
                "Failed to send email for contact submission %s",
                submission.pk,
            )