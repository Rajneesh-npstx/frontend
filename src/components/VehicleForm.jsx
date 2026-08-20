import { useState } from "react";
import { createVehicle } from "../services/api";

function VehicleForm({ onClose, onVehicleCreated }) {
  const [formData, setFormData] = useState({
    regNumber: "",
    model: "",
    ownerName: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors({});
    setServerError("");

    try {
      setSaving(true);

      const vehicle = await createVehicle(formData);

      onVehicleCreated(vehicle);
      onClose();
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        setErrors(responseData.errors);
      } else {
        setServerError(responseData?.message || "Unable to create vehicle.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Add Vehicle</h2>
            <p>Enter the vehicle details below.</p>
          </div>

          <button className="close-button" onClick={onClose} type="button">
            ×
          </button>
        </div>

        {serverError && <div className="form-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="regNumber">Registration Number</label>

            <input
              id="regNumber"
              name="regNumber"
              type="text"
              placeholder="e.g. MH05AB1234"
              value={formData.regNumber}
              onChange={handleChange}
            />

            {errors.regNumber && (
              <span className="field-error">{errors.regNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="model">Model</label>

            <input
              id="model"
              name="model"
              type="text"
              placeholder="e.g. Swift VXI"
              value={formData.model}
              onChange={handleChange}
            />

            {errors.model && (
              <span className="field-error">{errors.model}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="ownerName">Owner Name</label>

            <input
              id="ownerName"
              name="ownerName"
              type="text"
              placeholder="e.g. Raj"
              value={formData.ownerName}
              onChange={handleChange}
            />

            {errors.ownerName && (
              <span className="field-error">{errors.ownerName}</span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Adding..." : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleForm;
