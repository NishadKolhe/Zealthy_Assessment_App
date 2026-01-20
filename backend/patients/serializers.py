from rest_framework import serializers
from .models import Patient
from appointments.models import Appointment
from prescriptions.models import Prescription

class PatientSerializer(serializers.ModelSerializer):
   
    appointments = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True
    )
    prescriptions = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True
    )

    class Meta:
        model = Patient
        fields = [
            'id', 'email', 'password', 'first_name', 'last_name', 
            'date_of_birth', 'created_at', 'updated_at',
            'appointments', 'prescriptions'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }
