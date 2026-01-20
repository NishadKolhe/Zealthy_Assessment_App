from rest_framework import serializers
from .models import Prescription, Medication
from patients.models import Patient

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ['id', 'name']

class PrescriptionSerializer(serializers.ModelSerializer):
    patient_email = serializers.ReadOnlyField(source='patient.email')
    medication_name = serializers.ReadOnlyField(source='medication.name')

    class Meta:
        model = Prescription
        fields = [
            'id', 'patient', 'patient_email', 'medication', 'medication_name',
            'dosage', 'quantity', 'refill_date', 'refill_schedule',
            'created_at', 'updated_at'
        ]
