from django.shortcuts import render
from rest_framework import viewsets
from .models import Patient
from .serializers import PatientSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from appointments.models import Appointment
from prescriptions.models import Prescription
from prescriptions.serializers import PrescriptionSerializer
from appointments.serializers import AppointmentSerializer
from datetime import datetime, timedelta

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


@api_view(['POST'])
def patient_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'error': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        patient = Patient.objects.get(email=email, password=password)
    except Patient.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
   
    patient_data = PatientSerializer(patient).data
    
    today = datetime.today().date()
    seven_days_later = today + timedelta(days=7)
    
    upcoming_appointments = Appointment.objects.filter(
        patient=patient, start_datetime__date__gte=today, start_datetime__date__lte=seven_days_later
    )
    upcoming_prescriptions = Prescription.objects.filter(
        patient=patient, refill_date__gte=today, refill_date__lte=seven_days_later
    )
    
    appointments_data = AppointmentSerializer(upcoming_appointments, many=True).data
    prescriptions_data = PrescriptionSerializer(upcoming_prescriptions, many=True).data
    
    return Response({
        'patient': patient_data,
        'upcoming_appointments': appointments_data,
        'upcoming_prescriptions': prescriptions_data
    })


@api_view(['GET'])
def full_appointment_schedule(request, patient_id):
   
    today = datetime.today()
    three_months_later = today + timedelta(days=90)
    
    appointments = Appointment.objects.filter(
        patient_id=patient_id,
        start_datetime__gte=today,
        start_datetime__lte=three_months_later
    )
    
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)