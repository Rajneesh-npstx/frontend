import { useEffect, useState } from "react";
import { getVehicles, deleteVehicle } from "./services/api";

import VehicleForm from "./components/VehicleForm";
import EditVehicleForm from "./components/EditVehicleForm";
import ServiceHistory from "./components/ServiceHistory";
import ServiceRecordForm from "./components/ServiceRecordForm";

import "./App.css";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);

  const [showVehicleForm, setShowVehicleForm] = useState(false);

  const [editingVehicle, setEditingVehicle] = useState(null);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [showServiceForm, setShowServiceForm] = useState(false);

  const [editingServiceRecord, setEditingServiceRecord] = useState(null);

  const loadVehicles = async (page = currentPage, size = pageSize) => {
    try {
      setLoading(true);
      setError("");

      const data = await getVehicles(page, size);

      setVehicles(data.content);
      setCurrentPage(data.number);
      setTotalPages(data.totalPages);
      setTotalVehicles(data.totalElements);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleVehicleCreated = async () => {
    /*
     * If we are already on the first page, changing currentPage
     * to 0 would not trigger useEffect because it is already 0.
     * So explicitly reload the first page.
     */
    if (currentPage === 0) {
      await loadVehicles(0, pageSize);
    } else {
      /*
       * If we are on another page, move to the first page.
       * The useEffect will load the data for page 0.
       */
      setCurrentPage(0);
    }
  };

  const handleVehicleUpdated = async () => {
    await loadVehicles(currentPage, pageSize);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteVehicle(id);

      /*
       * If the current page becomes empty after deletion,
       * move to the previous page.
       */
      if (vehicles.length === 1 && currentPage > 0) {
        setCurrentPage((previous) => previous - 1);
      } else {
        await loadVehicles(currentPage, pageSize);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete vehicle.");
    }
  };

  const handlePageChange = (page) => {
    if (page < 0 || page >= totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    const newSize = Number(event.target.value);

    setPageSize(newSize);
    setCurrentPage(0);
  };

  const handleViewHistory = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowServiceForm(false);
    setEditingServiceRecord(null);
  };

  const handleCloseHistory = () => {
    setSelectedVehicle(null);
    setShowServiceForm(false);
    setEditingServiceRecord(null);
  };

  const handleAddService = () => {
    setEditingServiceRecord(null);
    setShowServiceForm(true);
  };

  const handleEditService = (record) => {
    setEditingServiceRecord(record);
    setShowServiceForm(true);
  };

  const handleCloseServiceForm = () => {
    setShowServiceForm(false);
    setEditingServiceRecord(null);
  };

  const handleServiceChanged = async () => {
    setShowServiceForm(false);
    setEditingServiceRecord(null);

    await loadVehicles(currentPage, pageSize);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>AutoCare</h1>
          <p>Vehicle Service Log</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowVehicleForm(true)}
        >
          + Add Vehicle
        </button>
      </header>

      <main className="main-content">
        <section className="page-heading">
          <div>
            <h2>Vehicles</h2>

            <p>Manage vehicles and track their service history.</p>
          </div>

          <div className="vehicle-count">
            {totalVehicles} vehicle
            {totalVehicles !== 1 ? "s" : ""}
          </div>
        </section>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading vehicles...</div>
        ) : vehicles.length === 0 ? (
          <div className="empty-state">
            <h3>No vehicles found</h3>

            <p>Add your first vehicle to start tracking service history.</p>

            <button
              className="primary-button empty-add-button"
              onClick={() => setShowVehicleForm(true)}
            >
              + Add Vehicle
            </button>
          </div>
        ) : (
          <>
            <div className="vehicle-grid">
              {vehicles.map((vehicle) => (
                <div className="vehicle-card" key={vehicle.id}>
                  <div className="vehicle-card-header">
                    <div>
                      <span className="registration">{vehicle.regNumber}</span>

                      <h3>{vehicle.model}</h3>
                    </div>

                    <span
                      className={
                        vehicle.overdue ? "status overdue" : "status active"
                      }
                    >
                      {vehicle.overdue ? "OVERDUE" : "UP TO DATE"}
                    </span>
                  </div>

                  <div className="vehicle-info">
                    <div>
                      <span>Owner</span>

                      <strong>{vehicle.ownerName}</strong>
                    </div>

                    <div>
                      <span>Next Service</span>

                      <strong>
                        {vehicle.nextServiceDue
                          ? vehicle.nextServiceDue
                          : "Not scheduled"}
                      </strong>
                    </div>
                  </div>

                  <div className="vehicle-actions">
                    <button onClick={() => handleViewHistory(vehicle)}>
                      View History
                    </button>

                    <button onClick={() => setEditingVehicle(vehicle)}>
                      Edit
                    </button>

                    <button
                      className="danger-button"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 0 && (
              <div className="pagination">
                <div className="page-size">
                  <span>Show</span>

                  <select value={pageSize} onChange={handlePageSizeChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>

                  <span>per page</span>
                </div>

                <div className="pagination-controls">
                  <button
                    className="pagination-button"
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    ← Previous
                  </button>

                  <span className="page-indicator">
                    Page {currentPage + 1} of {totalPages}
                  </span>

                  <button
                    className="pagination-button"
                    disabled={currentPage === totalPages - 1}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Vehicle */}

      {showVehicleForm && (
        <VehicleForm
          onClose={() => setShowVehicleForm(false)}
          onVehicleCreated={handleVehicleCreated}
        />
      )}

      {/* Edit Vehicle */}

      {editingVehicle && (
        <EditVehicleForm
          vehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onVehicleUpdated={handleVehicleUpdated}
        />
      )}

      {/* Service History */}

      {selectedVehicle && !showServiceForm && (
        <ServiceHistory
          vehicle={selectedVehicle}
          onClose={handleCloseHistory}
          onAddService={handleAddService}
          onEditService={handleEditService}
          onServiceChanged={loadVehicles}
        />
      )}

      {/* Add / Edit Service */}

      {selectedVehicle && showServiceForm && (
        <ServiceRecordForm
          vehicle={selectedVehicle}
          record={editingServiceRecord}
          onClose={handleCloseServiceForm}
          onServiceChanged={handleServiceChanged}
        />
      )}
    </div>
  );
}

export default App;
