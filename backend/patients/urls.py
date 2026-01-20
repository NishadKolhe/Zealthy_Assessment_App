from django.urls import path
from .views import patient_login, full_appointment_schedule

urlpatterns = [
    path('login/', patient_login, name='patient-login'),
    path('<int:patient_id>/appointments/', full_appointment_schedule, name='full-appointments'),
]
