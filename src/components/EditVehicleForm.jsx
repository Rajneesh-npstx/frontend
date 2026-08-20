import { useState } from "react";
import { updateVehicle } from "../services/api";

function EditVehicleForm({ vehicle, onClose, onVehicleUpdated }) {
  const [formData, setFormData] = useState({
    regNumber: vehicle.regNumber,
    model: vehicle.model,
    ownerName: vehicle.ownerName,
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

      const updatedVehicle = await updateVehicle(vehicle.id, formData);

      onVehicleUpdated(updatedVehicle);
      onClose();
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        setErrors(responseData.errors);
      } else {
        setServerError(responseData?.message || "Unable to update vehicle.");
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
            <span className="registration">{vehicle.regNumber}</span>

            <h2>Edit Vehicle</h2>

            <p>Update the vehicle details below.</p>
          </div>

          <button className="close-button" onClick={onClose} type="button">
            ×
          </button>
        </div>

        {serverError && <div className="form-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-regNumber">Registration Number</label>

            <input
              id="edit-regNumber"
              name="regNumber"
              type="text"
              value={formData.regNumber}
              onChange={handleChange}
            />

            {errors.regNumber && (
              <span className="field-error">{errors.regNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="edit-model">Model</label>

            <input
              id="edit-model"
              name="model"
              type="text"
              value={formData.model}
              onChange={handleChange}
            />

            {errors.model && (
              <span className="field-error">{errors.model}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="edit-ownerName">Owner Name</label>

            <input
              id="edit-ownerName"
              name="ownerName"
              type="text"
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
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVehicleForm;
