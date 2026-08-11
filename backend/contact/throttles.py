from rest_framework.throttling import UserRateThrottle


class ContactSubmissionBurstThrottle(UserRateThrottle):
    scope = "contact_submission_burst"


class ContactSubmissionDailyThrottle(UserRateThrottle):
    scope = "contact_submission_daily"


class QuoteRequestBurstThrottle(UserRateThrottle):
    scope = "quote_request_burst"


class QuoteRequestDailyThrottle(UserRateThrottle):
    scope = "quote_request_daily"


class JobApplicationBurstThrottle(UserRateThrottle):
    scope = "job_application_burst"


class JobApplicationDailyThrottle(UserRateThrottle):
    scope = "job_application_daily"
