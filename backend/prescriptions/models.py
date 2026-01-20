from django.db import models
from patients.models import Patient


class Medication(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
class Prescription(models.Model):

    class RefillSchedule(models.TextChoices):
        MONTHLY = "MONTHLY", "Monthly"

    # NOTE: Dosages come from seed data — stored as controlled strings
    DOSAGE_CHOICES = [
        ("1mg", "1mg"),
        ("2mg", "2mg"),
        ("3mg", "3mg"),
        ("5mg", "5mg"),
        ("10mg", "10mg"),
        ("25mg", "25mg"),
        ("50mg", "50mg"),
        ("100mg", "100mg"),
        ("250mg", "250mg"),
        ("500mg", "500mg"),
        ("1000mg", "1000mg"),
    ]

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="prescriptions"
    )

    medication = models.ForeignKey(
        Medication,
        on_delete=models.PROTECT,
        related_name="prescriptions"
    )

    dosage = models.CharField(
        max_length=10,
        choices=DOSAGE_CHOICES
    )

    quantity = models.PositiveIntegerField()
    refill_date = models.DateField()

    refill_schedule = models.CharField(
        max_length=20,
        choices=RefillSchedule.choices,
        default=RefillSchedule.MONTHLY
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient.email} - {self.medication.name}"
