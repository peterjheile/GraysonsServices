from unittest.mock import patch

from django.db import DatabaseError
from django.test import TestCase
from django.urls import reverse


class HealthcheckTests(TestCase):
    def test_healthcheck_reports_ok_when_database_is_available(self):
        response = self.client.get(reverse("healthcheck"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})
        self.assertIn("no-store", response.headers["Cache-Control"])

    @patch("core.health.connections")
    def test_healthcheck_reports_failure_when_database_is_unavailable(
        self,
        mocked_connections,
    ):
        mocked_connections.__getitem__.side_effect = DatabaseError

        response = self.client.get(reverse("healthcheck"))

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json(), {"status": "unhealthy"})
