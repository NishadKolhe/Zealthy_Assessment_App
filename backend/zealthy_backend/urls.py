from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from patients.views import PatientViewSet
from appointments.views import AppointmentViewSet
from prescriptions.views import PrescriptionViewSet, MedicationViewSet


router = routers.DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'prescriptions', PrescriptionViewSet, basename='prescription')
router.register(r'medications', MedicationViewSet, basename='medication')



urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/patients/', include('patients.urls')),
    path('api/', include(router.urls)),
]
