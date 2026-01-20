import json
from pathlib import Path
from django.core.management.base import BaseCommand
from patients.models import Patient
from appointments.models import Appointment
from prescriptions.models import Medication, Prescription
from django.utils.dateparse import parse_datetime, parse_date

class Command(BaseCommand):
    help = "Seed medications, patients, appointments, and prescriptions from data.json"

    def handle(self, *args, **kwargs):
       
        BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent                               # loading data.json
        data_file = BASE_DIR / "data.json"
        with open(data_file) as f:
            data = json.load(f)

       
        self.stdout.write("Seeding Medications...")                                           # seeding medications
        for med_name in data.get("medications", []):
            Medication.objects.get_or_create(name=med_name)

       
        self.stdout.write("Seeding Patients...")                                               # seeding patients
        for user in data.get("users", []):
            patient, _ = Patient.objects.get_or_create(
                email=user["email"],
                defaults={
                    "first_name": user["name"].split()[0],
                    "last_name": " ".join(user["name"].split()[1:]),
                    "password": user["password"]
                }
            )

           
            for appt in user.get("appointments", []):                                             # seeding appointments
                Appointment.objects.get_or_create(
                    patient=patient,
                    provider_name=appt["provider"],
                    start_datetime=parse_datetime(appt["datetime"]),
                    recurrence_type=appt["repeat"].upper() if appt.get("repeat") else "NONE"
                )

             
            for pres in user.get("prescriptions", []):                                             # seeding prescriptions
                med = Medication.objects.get(name=pres["medication"])
                Prescription.objects.get_or_create(
                    patient=patient,
                    medication=med,
                    dosage=pres["dosage"],
                    quantity=pres["quantity"],
                    refill_date=parse_date(pres["refill_on"]),
                    refill_schedule=pres["refill_schedule"].upper()
                )

        self.stdout.write(self.style.SUCCESS("All data seeded successfully!"))
