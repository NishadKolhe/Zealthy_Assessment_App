import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import DataTable from "../components/DataTable";
import "../styles/ManagePatient.css";
import AddDialogueBox from "../components/AddDialogueBox";
import AddPrescriptionDialogueBox from "../components/AddPrescriptionDialogueBox";
import api from "../api/api";

export default function ManagePatient() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const [prescriptions, setPrescriptions] = useState([]);

  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    provider_name: "",
    date: "",
    time: "",
    recurrence_type: "WEEKLY",
    recurrence_end_date: "",
  });

  const [showAddPrescription, setShowAddPrescription] = useState(false);
  const [medications, setMedications] = useState([]);

  const openAddAppointment = () => setShowAddAppointment(true);
  const closeAddAppointment = () => setShowAddAppointment(false);

  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editingPrescription, setEditingPrescription] = useState(null);

  const handleNewAppointmentChange = (name, value) => {
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAppointment = async (appointmentData) => {
    const data = appointmentData || newAppointment;

    const start_datetime = `${data.date}T${data.time}`;
    let recurrenceEndDate = data.recurrence_end_date;

    if (!recurrenceEndDate && data.recurrence_type !== "NONE") {
      const defaultEnd = new Date(data.date);
      defaultEnd.setMonth(defaultEnd.getMonth() + 3);
      recurrenceEndDate = defaultEnd.toISOString().split("T")[0];
    }

    const body = {
      patient: Number(patientId),
      provider_name: data.provider_name,
      start_datetime,
      recurrence_type: data.recurrence_type,
      recurrence_end_date: recurrenceEndDate,
    };
    try {
      const response = await api.post("/appointments/", body);
      const added = response.data;

      const newAppointments = expandRecurrence(added);

      setAppointments((prev) =>
        [...prev, ...newAppointments].sort(
          (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime),
        ),
      );

      closeAddAppointment();
      setNewAppointment({
        provider_name: "",
        date: "",
        time: "",
        recurrence_type: "WEEKLY",
        recurrence_end_date: "",
      });

      alert("Appointment added successfully!");
    } catch (err) {
      alert(
        "Failed to add appointment: " +
          (err.response?.data?.detail || "Unknown error"),
      );
    }
  };

  const handleUpdateAppointment = async (data) => {
    try {
      await api.put(`/appointments/${editingAppointment.id}/`, {
        patient: patient.id,
        provider_name: data.provider_name,
        start_datetime: `${data.date}T${data.time}`,
        recurrence_type: data.recurrence_type,
        recurrence_end_date: data.recurrence_end_date,
      });

      alert("Appointment updated");
      setEditingAppointment(null);
      fetchAppointments();
    } catch (err) {
      alert("Failed to update appointment");
    }
  };

  const handleUpdatePrescription = async (data) => {
    try {
      await api.put(`/prescriptions/${editingPrescription.id}/`, {
        patient: patient.id,
        medication: data.medication,
        dosage: data.dosage,
        quantity: data.quantity,
        refill_date: data.refill_date,
        refill_schedule: data.refill_schedule,
      });

      alert("Prescription updated");
      setEditingPrescription(null);
      fetchPrescriptions();
    } catch (err) {
      alert("Failed to update prescription");
    }
  };

  // Fetch patient details
  useEffect(() => {
    if (!patientId) return;

    const loadPatient = async () => {
      try {
        const res = await api.get(`/patients/${patientId}/`);
        const data = res.data;

        setPatient(data);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
      } catch (err) {
        alert("Failed to load patient");
      }
    };

    loadPatient();
  }, [patientId]);

  useEffect(() => {
    const loadMedications = async () => {
      try {
        const res = await api.get("/medications/");
        setMedications(res.data);
      } catch (err) {
        alert("Failed to load medications");
      }
    };

    loadMedications();
  }, []);

  const handleDeleteAppointment = async (appointment) => {
    const ok = window.confirm(
      "This is a recurring appointment.\nDeleting will remove the entire series.",
    );
    if (!ok) return;

    try {
      await api.delete(`/appointments/${appointment.id}/`);
      alert("Appointment series deleted");
      fetchAppointments();
    } catch (err) {
      alert("Failed to delete appointment");
    }
  };

  // ===== DELETE PRESCRIPTION =====
  const handleDeletePrescription = async (prescription) => {
    const ok = window.confirm(
      "Deleting will remove the entire prescription record.",
    );
    if (!ok) return;

    try {
      await api.delete(`/prescriptions/${prescription.id}/`);
      alert("Prescription deleted");
      fetchPrescriptions();
    } catch (err) {
      alert("Failed to delete prescription");
    }
  };

  // Handle patient save
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/patients/${patientId}/`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: patient?.password || "Password1234",
      });

      setPatient(res.data);
      alert("Patient updated successfully!");
    } catch (err) {
      alert("Failed to update patient");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrescription = async (data) => {
    try {
      const res = await api.post("/prescriptions/", {
        patient: Number(patientId),
        medication: data.medication,
        dosage: data.dosage,
        quantity: data.quantity,
        refill_date: data.refill_date,
        refill_schedule: data.refill_schedule,
      });

      setPrescriptions((prev) => [...prev, res.data]);
      setShowAddPrescription(false);
      alert("Prescription added successfully!");
    } catch (err) {
      alert("Failed to add prescription");
    }
  };

  // Expand recurring appointments
  const expandRecurrence = (appt) => {
    const results = [];
    const startDate = new Date(appt.start_datetime);
    const recurrenceEndDate = appt.recurrence_end_date
      ? new Date(appt.recurrence_end_date)
      : new Date(new Date().setMonth(new Date().getMonth() + 3));

    let currentDate = new Date(startDate);
    while (currentDate <= recurrenceEndDate) {
      results.push({
        ...appt,
        start_datetime: currentDate.toISOString(),
        _rowKey: `${appt.id}-${currentDate.toISOString()}`,
      });
      if (appt.recurrence_type === "WEEKLY")
        currentDate.setDate(currentDate.getDate() + 7);
      else if (appt.recurrence_type === "MONTHLY")
        currentDate.setMonth(currentDate.getMonth() + 1);
      else break;
    }
    return results;
  };
  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/");
      const data = res.data;

      const patientAppointments = data.filter(
        (a) => a.patient === Number(patientId),
      );
      const expandedAppointments =
        patientAppointments.flatMap(expandRecurrence);
      expandedAppointments.sort(
        (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime),
      );

      setAppointments(expandedAppointments);
    } catch (err) {
      alert("Failed to load appointments");
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get("/prescriptions/");
      const data = res.data;

      const patientPrescriptions = data.filter(
        (p) => p.patient === Number(patientId),
      );
      setPrescriptions(patientPrescriptions);
    } catch (err) {
      alert("Failed to load prescriptions");
    }
  };

  // Fetch appointments
  useEffect(() => {
    if (!patientId) return;
    fetchAppointments();
  }, [patientId]);
  //Fetch prescriptions
  useEffect(() => {
    if (!patientId) return;
    fetchPrescriptions();
  }, [patientId]);

  if (!patient) return <p>Loading...</p>;

  const visibleAppointments = expanded
    ? appointments
    : appointments.slice(0, 5);

  return (
    <>
      <Topbar
        title="Zealthy MiniEMR Admin"
        navLabel="< Back"
        navPath="/admin"
        onLogout={() => {
          localStorage.removeItem("admin");
          navigate("/");
        }}
      />

      <div className="manage-patient-page">
        {/* Patient Info */}
        <div className="manage-patient-header">
          <h2 className="manage-patient-title">Patient</h2>
          <div className="manage-patient-fields">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="save-button"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Appointments Table */}
        <div style={{ marginTop: "32px" }}>
          <DataTable
            title="Appointments"
            titleAction={
              <button
                className="topbar-logout-btn"
                onClick={openAddAppointment}
              >
                Add Appointment
              </button>
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
              { header: "Recurrence", accessor: "recurrence_type" },
              {
                header: "Action",
                render: (row) => (
                  <>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="topbar-logout-btn"
                        onClick={() => setEditingAppointment(row)}
                      >
                        Edit
                      </button>
                      <button
                        className="topbar-logout-btn"
                        onClick={() => handleDeleteAppointment(row)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                ),
              },
            ]}
            data={visibleAppointments}
            footerAction={
              appointments.length > 5 && (
                <button
                  className="topbar-logout-btn"
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  {expanded ? "Show less" : "Show all"}
                </button>
              )
            }
          />
        </div>

        {/* Add Appointment Dialog */}
        {showAddAppointment && (
          <AddDialogueBox
            title="Add Appointment"
            onClose={closeAddAppointment}
            onSubmit={(formData) => {
              setNewAppointment(formData);
              handleSaveAppointment(formData);
            }}
          />
        )}

        {editingAppointment && (
          <AddDialogueBox
            title="Edit Appointment"
            fields={[
              { label: "Provider", name: "provider_name", required: true },
              { label: "Date", name: "date", type: "date", required: true },
              { label: "Time", name: "time", type: "time", required: true },
              {
                label: "Repeat",
                name: "recurrence_type",
                type: "select",
                options: ["WEEKLY", "MONTHLY"],
                required: true,
              },
              {
                label: "Recurrence End Date",
                name: "recurrence_end_date",
                type: "date",
                required: true,
              },
            ]}
            initialValues={{
              provider_name: editingAppointment.provider_name,
              date: editingAppointment.start_datetime.split("T")[0],
              time: editingAppointment.start_datetime.split("T")[1].slice(0, 5),
              recurrence_type: editingAppointment.recurrence_type,
              recurrence_end_date: editingAppointment.recurrence_end_date,
            }}
            onSubmit={handleUpdateAppointment}
            onClose={() => setEditingAppointment(null)}
            submitLabel="Save Changes"
          />
        )}

        {/* Prescriptions Table */}
        <div style={{ marginTop: "32px" }}>
          <DataTable
            title="Prescriptions"
            titleAction={
              <button
                className="topbar-logout-btn"
                onClick={() => setShowAddPrescription(true)}
              >
                Add Prescription
              </button>
            }
            columns={[
              { header: "Medication", accessor: "medication_name" },
              { header: "Dosage", accessor: "dosage" },
              { header: "Quantity", accessor: "quantity" },
              { header: "Refill On", accessor: "refill_date" },
              { header: "Refill Schedule", accessor: "refill_schedule" },
              {
                header: "Action",
                render: (row) => (
                  <>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="topbar-logout-btn"
                        onClick={() => {
                          const originalPrescription = prescriptions.find(
                            (p) => p.id === row.id,
                          );
                          setEditingPrescription(originalPrescription);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="topbar-logout-btn"
                        onClick={() => handleDeletePrescription(row)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                ),
              },
            ]}
            data={prescriptions.flatMap((p) => {
              const results = [];
              const startDate = new Date(p.refill_date);
              const endDate = new Date(
                new Date().setMonth(new Date().getMonth() + 3),
              );
              let currentDate = new Date(startDate);
              while (currentDate <= endDate) {
                results.push({
                  ...p,
                  refill_date: currentDate.toISOString().split("T")[0],
                  _rowKey: `${p.id}-${currentDate.toISOString()}`,
                });
                currentDate.setMonth(currentDate.getMonth() + 1);
              }
              return results;
            })}
          />
        </div>
        {showAddPrescription && (
          <AddPrescriptionDialogueBox
            medications={medications}
            onClose={() => setShowAddPrescription(false)}
            onSubmit={handleSavePrescription}
          />
        )}

        {editingPrescription && (
          <AddPrescriptionDialogueBox
            title="Edit Prescription"
            medications={medications} // same prop as Add
            initialValues={{
              medication: editingPrescription.medication?.id,
              dosage: editingPrescription.dosage,
              quantity: editingPrescription.quantity,
              refill_date: editingPrescription.refill_date,
              refill_schedule: "MONTHLY",
            }}
            onSubmit={handleUpdatePrescription}
            onClose={() => setEditingPrescription(null)}
            submitLabel="Save Changes"
          />
        )}
      </div>
    </>
  );
}
