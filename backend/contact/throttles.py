from rest_framework.throttling import UserRateThrottle


class ContactBurstThrottle(UserRateThrottle):
    scope = "contact_burst"


class ContactDailyThrottle(UserRateThrottle):
    scope = "contact_daily"