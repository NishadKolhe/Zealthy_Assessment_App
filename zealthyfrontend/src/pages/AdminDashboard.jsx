import Topbar from "../components/Topbar";
import { useEffect, useState, useCallback } from "react";
import DataTable from "../components/DataTable";
import Dialoguebox from "../components/Dialoguebox";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const [showDialogue, setShowDialogue] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/";
  };

  const handleAddPatient = async (formData) => {
    try {
      const response = await api.post("/patients/", formData);
      setPatients((prev) => [...prev, response.data]);
      setShowDialogue(false);
      alert("Patient created successfully!");
    } catch (err) {
      alert(
        "Failed to create patient: " +
          (err.response?.data?.detail || err.message || "Unknown error"),
      );
    }
  };

  const fetchPatients = useCallback(async () => {
    try {
      const res = await api.get("/patients/");
      setPatients(res.data);
    } catch (err) {
      alert(
        "Failed to load patients: " +
          (err.response?.data?.detail || err.message || "Unknown error"),
      );
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return (
    <>
      <Topbar
        title="Zealthy MiniEMR Admin"
        navLabel="Patients"
        navPath="/admin"
        onLogout={handleLogout}
      />

      <div style={{ padding: "24px" }}>
        <DataTable
          title="Patients"
          titleAction={
            <button
              className="topbar-logout-btn"
              onClick={() => setShowDialogue(true)}
            >
              Add Patient
            </button>
          }
          columns={[
            {
              header: "Name",
              accessor: (row) => `${row.first_name} ${row.last_name}`,
            },
            { header: "Email", accessor: "email" },
            {
              header: "Action",
              render: (row) => (
                <button
                  className="topbar-logout-btn"
                  onClick={() => navigate(`/admin/patient/${row.id}`)}
                >
                  Manage
                </button>
              ),
            },
          ]}
          data={patients}
        />
      </div>

      {showDialogue && (
        <Dialoguebox
          title="Create New Patient"
          fields={[
            { label: "First Name", name: "first_name", required: true },
            { label: "Last Name", name: "last_name", required: true },
            { label: "Email", name: "email", type: "email", required: true },
            {
              label: "Password",
              name: "password",
              type: "password",
              required: true,
            },
          ]}
          submitLabel="Create"
          onClose={() => setShowDialogue(false)}
          onSubmit={handleAddPatient}
        />
      )}
    </>
  );
}
