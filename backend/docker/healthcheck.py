import os
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


host = os.getenv("HEALTHCHECK_HOST", "graysonsservices.com")
request = Request(
    "http://127.0.0.1:8000/api/health/",
    headers={
        "Host": host,
        "X-Forwarded-Proto": "https",
    },
)

try:
    with urlopen(request, timeout=5) as response:
        healthy = response.status == 200
except (HTTPError, URLError, TimeoutError, OSError):
    healthy = False

sys.exit(0 if healthy else 1)