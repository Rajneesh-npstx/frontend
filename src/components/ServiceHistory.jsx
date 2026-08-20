import { useEffect, useState } from "react";
import { getServiceRecords, deleteServiceRecord } from "../services/api";

function ServiceHistory({
  vehicle,
  onClose,
  onAddService,
  onEditService,
  onServiceChanged,
}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServiceHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getServiceRecords(vehicle.id);

      setRecords(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load service history.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServiceHistory();
  }, [vehicle.id]);

  const handleDeleteService = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service record?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteServiceRecord(id);

      await loadServiceHistory();
      onServiceChanged();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete service record.",
      );
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="history-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="history-header">
          <div>
            <span className="registration">{vehicle.regNumber}</span>

            <h2>{vehicle.model}</h2>

            <p>Owner: {vehicle.ownerName}</p>
          </div>

          <button className="close-button" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <div className="history-title-row">
          <div>
            <h3>Service History</h3>

            <p>
              {records.length} service record
              {records.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            className="primary-button"
            onClick={onAddService}
            type="button"
          >
            + Add Service
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        {loading && (
          <div className="history-loading">Loading service history...</div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className="history-empty">
            <h3>No service records</h3>

            <p>Add a service record to start tracking maintenance.</p>
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="service-record-list">
            {records.map((record) => (
              <div className="service-record" key={record.id}>
                <div className="service-record-main">
                  <div>
                    <h4>{record.description}</h4>

                    <span>Service date: {record.serviceDate}</span>
                  </div>

                  <span
                    className={
                      record.overdue ? "status overdue" : "status active"
                    }
                  >
                    {record.overdue ? "OVERDUE" : "UP TO DATE"}
                  </span>
                </div>

                <div className="service-record-footer">
                  <div>
                    <span>Next service due</span>

                    <strong>{record.nextServiceDue}</strong>
                  </div>

                  <div className="record-actions">
                    <button
                      type="button"
                      className="record-action"
                      onClick={() => onEditService(record)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="record-action record-delete"
                      onClick={() => handleDeleteService(record.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="history-footer">
          <button type="button" className="secondary-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceHistory;
