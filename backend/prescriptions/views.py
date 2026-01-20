from django.shortcuts import render
from rest_framework import viewsets
from .models import Prescription, Medication
from .serializers import PrescriptionSerializer, MedicationSerializer

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

class MedicationViewSet(viewsets.ModelViewSet):
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer

