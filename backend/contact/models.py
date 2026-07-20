from django.db import models


class ContactSubmission(models.Model):
    first_name = models.CharField(
        max_length=100,
    )
    last_name = models.CharField(
        max_length=100,
    )
    email = models.EmailField()
    phone = models.CharField(
        max_length=30,
        blank=True,
    )
    subject = models.CharField(
        max_length=150,
    )
    message = models.TextField()
    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Contact Submission"
        verbose_name_plural = "Contact Submissions"

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.subject}"