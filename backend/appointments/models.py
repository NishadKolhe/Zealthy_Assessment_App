from django.db import models
from patients.models import Patient


class Appointment(models.Model):

    class RecurrenceType(models.TextChoices):
        NONE = "NONE", "None"
        WEEKLY = "WEEKLY", "Weekly"
        MONTHLY = "MONTHLY", "Monthly"

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    provider_name = models.CharField(max_length=255)
    start_datetime = models.DateTimeField()

    recurrence_type = models.CharField(
        max_length=10,
        choices=RecurrenceType.choices,
        default=RecurrenceType.NONE
    )

    recurrence_end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient.email} - {self.start_datetime}"
