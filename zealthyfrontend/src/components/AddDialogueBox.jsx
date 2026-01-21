import { useState, useEffect } from "react";
import "../styles/Dialoguebox.css";

export default function AddDialogueBox({
  title,
  onClose,
  onSubmit,
  submitLabel = "Save",
}) {
  const [formData, setFormData] = useState({
    provider_name: "",
    date: "",
    time: "",
    recurrence_type: "WEEKLY",
    recurrence_end_date: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.provider_name || !formData.date || !formData.time) {
      alert("Please fill all required fields (Provider, Date, Time)");
      return;
    }

    onSubmit(formData);
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
          <div className="dialogue-form-group">
            <label>Provider</label>
            <input
              type="text"
              value={formData.provider_name}
              onChange={(e) => handleChange("provider_name", e.target.value)}
            />
          </div>

          <div className="dialogue-form-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          <div className="dialogue-form-group">
            <label>Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
            />
          </div>

          <div className="dialogue-form-group">
            <label>Repeat</label>
            <select
              value={formData.recurrence_type}
              onChange={(e) => handleChange("recurrence_type", e.target.value)}
            >
              <option value="NONE">None</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>

          <div className="dialogue-form-group">
            <label>Recurrence End Date</label>
            <input
              type="date"
              value={formData.recurrence_end_date}
              onChange={(e) =>
                handleChange("recurrence_end_date", e.target.value)
              }
            />
          </div>

          <button type="submit" className="dialogue-submit">
            {submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
