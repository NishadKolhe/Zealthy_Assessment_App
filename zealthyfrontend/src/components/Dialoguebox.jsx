import { useState, useEffect } from "react";
import "../styles/Dialoguebox.css";

export default function DialogueBox({
  title,
  fields = [],
  onClose,
  onSubmit,
  submitLabel = "Submit",
}) {
  const [formData, setFormData] = useState({});

  // Initialize form data with empty strings for each field
  useEffect(() => {
    const initialData = {};
    fields.forEach((field) => {
      initialData[field.name] = "";
    });
    setFormData(initialData);
  }, [fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
          {fields.map((field, index) => (
            <div className="dialogue-form-group" key={index}>
              <label>{field.label}</label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required || false}
              />
            </div>
          ))}

          <button type="submit" className="dialogue-submit">
            {submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
