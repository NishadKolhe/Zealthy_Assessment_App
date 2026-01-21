import { useEffect, useState } from "react";
import "../styles/Dialoguebox.css";

export default function AddPrescriptionDialogueBox({
  title = "Add Prescription",
  onClose,
  onSubmit,
  medications = [],
}) {
  const [formData, setFormData] = useState({
    medication: "",
    dosage: "",
    quantity: "",
    refill_date: "",
    refill_schedule: "MONTHLY",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { medication, dosage, quantity, refill_date } = formData;

    if (!medication || !dosage || !quantity || !refill_date) {
      alert("Please fill all required fields");
      return;
    }

    onSubmit({
      ...formData,
      quantity: Number(quantity),
      medication: Number(medication),
    });
  };

  return (
    <div className="dialogue-overlay">
      <div className="dialogue-container">
        <div className="dialogue-header">
          <h2>{title}</h2>
          <button className="dialogue-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="dialogue-form" onSubmit={handleSubmit}>
          {/* Medication */}
          <div className="dialogue-form-group">
            <label>Medication</label>
            <select
              value={formData.medication}
              onChange={(e) => handleChange("medication", e.target.value)}
            >
              <option value="">Select medication</option>
              {medications.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dosage */}
          <div className="dialogue-form-group">
            <label>Dosage</label>
            <select
              value={formData.dosage}
              onChange={(e) => handleChange("dosage", e.target.value)}
              required
            >
              <option value="">Select dosage</option>
              {[
                "1mg",
                "2mg",
                "3mg",
                "5mg",
                "10mg",
                "25mg",
                "50mg",
                "100mg",
                "250mg",
                "500mg",
                "1000mg",
              ].map((dose) => (
                <option key={dose} value={dose}>
                  {dose}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="dialogue-form-group">
            <label>Quantity</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
            />
          </div>

          {/* Refill Date */}
          <div className="dialogue-form-group">
            <label>Refill Date</label>
            <input
              type="date"
              value={formData.refill_date}
              onChange={(e) => handleChange("refill_date", e.target.value)}
            />
          </div>

          {/* Refill Schedule */}
          <div className="dialogue-form-group">
            <label>Refill Schedule</label>
            <select
              value={formData.refill_schedule}
              onChange={(e) => handleChange("refill_schedule", e.target.value)}
            >
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>

          <button type="submit" className="dialogue-submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
