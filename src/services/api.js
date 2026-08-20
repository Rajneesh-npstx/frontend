import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getVehicles = async (page = 0, size = 5) => {
  const response = await api.get("/vehicles", {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

export const getVehicle = async (id) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

export const createVehicle = async (vehicle) => {
  const response = await api.post("/vehicles", vehicle);
  return response.data;
};

export const updateVehicle = async (id, vehicle) => {
  const response = await api.put(`/vehicles/${id}`, vehicle);
  return response.data;
};

export const deleteVehicle = async (id) => {
  await api.delete(`/vehicles/${id}`);
};

export const getServiceRecords = async (vehicleId) => {
  const response = await api.get(`/service-records/vehicle/${vehicleId}`);

  return response.data;
};

export const createServiceRecord = async (record) => {
  const response = await api.post("/service-records", record);

  return response.data;
};

export const updateServiceRecord = async (id, record) => {
  const response = await api.put(`/service-records/${id}`, record);

  return response.data;
};

export const deleteServiceRecord = async (id) => {
  await api.delete(`/service-records/${id}`);
};
