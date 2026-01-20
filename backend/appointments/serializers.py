from rest_framework import serializers
from .models import Appointment
from patients.models import Patient

class AppointmentSerializer(serializers.ModelSerializer):
    patient_email = serializers.ReadOnlyField(source='patient.email')

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_email', 'provider_name', 
            'start_datetime', 'recurrence_type', 'recurrence_end_date',
            'is_active', 'created_at', 'updated_at'
        ]
