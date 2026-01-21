import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import "../styles/PatientDashboard.css";
import api from "../api/api";

export default function PatientDashboard() {
  const patient = JSON.parse(localStorage.getItem("patient"));
  const patientId = patient?.id;

  const [appointments, setAppointments] = useState([]);
  const [appointmentsExpanded, setAppointmentsExpanded] = useState(false);

  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionsExpanded, setPrescriptionsExpanded] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("patient");
    window.location.href = "/";
  };

  const toggleAppointmentsExpanded = () => {
    setAppointmentsExpanded((prev) => !prev);
  };

  const togglePrescriptionsExpanded = () => {
    setPrescriptionsExpanded((prev) => !prev);
  };
  // Load patient appointments & prescriptions
  useEffect(() => {
    if (!patientId) return;

    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments/");
        const patientAppointments = res.data.filter(
          (appt) => appt.patient === patientId,
        );
        setAppointments(patientAppointments);
      } catch (err) {
        console.error("Failed to load appointments:", err);
        alert("Failed to load appointments");
      }
    };

    const fetchPrescriptions = async () => {
      try {
        const res = await api.get("/prescriptions/");
        const patientPrescriptions = res.data.filter(
          (presc) => presc.patient === patientId,
        );
        setPrescriptions(patientPrescriptions);
      } catch (err) {
        console.error("Failed to load prescriptions:", err);
        alert("Failed to load prescriptions");
      }
    };

    fetchAppointments();
    fetchPrescriptions();
  }, [patientId]);

  const today = new Date();
  const appointmentsEndDate = appointmentsExpanded
    ? new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())
    : new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

  const visibleAppointments = appointments.filter((appt) => {
    const apptDate = new Date(appt.start_datetime);
    return apptDate >= today && apptDate <= appointmentsEndDate;
  });

  // Filter visible prescriptions for 7 days or 3 months
  const prescriptionsEndDate = prescriptionsExpanded
    ? new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())
    : new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

  const visiblePrescriptions = prescriptions.filter((presc) => {
    const refillDate = new Date(presc.refill_date);
    return refillDate >= today && refillDate <= prescriptionsEndDate;
  });
  return (
    <>
      <Topbar
        title="Zealthy MiniEMR"
        navLabel="Dashboard"
        navPath="/patient/dashboard"
        onLogout={handleLogout}
      />
      <div style={{ padding: "24px" }}>
        <Card patient={patient} />

        <DataTable
          title={
            appointmentsExpanded
              ? "Upcoming Appointments (Next 3 Months)"
              : "Upcoming Appointments (Next 7 Days)"
          }
          titleAction={
            appointments.length > 0 && (
              <button
                className="topbar-logout-btn"
                onClick={toggleAppointmentsExpanded}
              >
                {appointmentsExpanded ? "Show less" : "Show all"}
              </button>
            )
          }
          columns={[
            { header: "Provider", accessor: "provider_name" },
            {
              header: "Date",
              accessor: (row) => row.start_datetime.split("T")[0],
            },
            {
              header: "Time",
              accessor: (row) => row.start_datetime.split("T")[1].slice(0, 5),
            },
            { header: "Repeat", accessor: "recurrence_type" },
          ]}
          data={visibleAppointments}
        />
        <DataTable
          title={
            prescriptionsExpanded
              ? "Medication Refills (Next 3 Months)"
              : "Medication Refills (Next 7 Days)"
          }
          titleAction={
            prescriptions.length > 0 && (
              <button
                className="topbar-logout-btn"
                onClick={togglePrescriptionsExpanded}
              >
                {prescriptionsExpanded ? "Show less" : "Show all"}
              </button>
            )
          }
          columns={[
            { header: "Medication", accessor: "medication_name" },
            { header: "Dosage", accessor: "dosage" },
            { header: "Quantity", accessor: "quantity" },
            { header: "Refill Date", accessor: "refill_date" },
            { header: "Schedule", accessor: "refill_schedule" },
          ]}
          data={visiblePrescriptions}
        />
      </div>
    </>
  );
}
