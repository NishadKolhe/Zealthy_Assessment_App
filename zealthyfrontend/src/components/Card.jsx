import "../styles/Card.css";

export default function Card({ patient }) {
  if (!patient) return null;

  return (
    <div className="patient-card">
      <h2 className="patient-card-title">Patient</h2>

      <div className="patient-card-content">
        <p className="patient-name">
          {patient.first_name} {patient.last_name}
        </p>
        <p className="patient-email">{patient.email}</p>
      </div>
    </div>
  );
}
