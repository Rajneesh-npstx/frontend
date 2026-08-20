import { useState } from "react";
import { createServiceRecord, updateServiceRecord } from "../services/api";

function ServiceRecordForm({
  vehicle,
  record = null,
  onClose,
  onServiceChanged,
}) {
  const isEditMode = record !== null;

  const [formData, setFormData] = useState({
    serviceDate: record?.serviceDate || "",
    description: record?.description || "",
    nextServiceDue: record?.nextServiceDue || "",
    vehicleId: vehicle.id,
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

      let savedRecord;

      if (isEditMode) {
        savedRecord = await updateServiceRecord(record.id, formData);
      } else {
        savedRecord = await createServiceRecord(formData);
      }

      onServiceChanged(savedRecord);
      onClose();
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        setErrors(responseData.errors);
      } else {
        setServerError(
          responseData?.message ||
            `Unable to ${isEditMode ? "update" : "create"} service record.`,
        );
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

            <h2>{isEditMode ? "Edit Service Record" : "Add Service Record"}</h2>

            <p>
              {vehicle.model} · {vehicle.ownerName}
            </p>
          </div>

          <button className="close-button" onClick={onClose} type="button">
            ×
          </button>
        </div>

        {serverError && <div className="form-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="serviceDate">Service Date</label>

            <input
              id="serviceDate"
              name="serviceDate"
              type="date"
              value={formData.serviceDate}
              onChange={handleChange}
            />

            {errors.serviceDate && (
              <span className="field-error">{errors.serviceDate}</span>
            )}
          </div>


          <div className="form-group">
            <label htmlFor="description">Description</label>

            <input
              id="description"
              name="description"
              type="text"
              placeholder="e.g. Engine oil change"
              value={formData.description}
              onChange={handleChange}
            />
            
            

            {errors.description && (
              <span className="field-error">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="nextServiceDue">Next Service Due</label>

            <input
              id="nextServiceDue"
              name="nextServiceDue"
              type="date"
              value={formData.nextServiceDue}
              onChange={handleChange}
            />

            {errors.nextServiceDue && (
              <span className="field-error">{errors.nextServiceDue}</span>
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
              {saving
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Save Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ServiceRecordForm;
