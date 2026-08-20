# AutoCare Frontend

This is the React frontend for the AutoCare Vehicle Service Log application.

It connects to the Spring Boot backend and provides the user interface for managing vehicles and service records.

## Tech Stack

- React
- Vite
- JavaScript
- Axios
- CSS

## Main Features

- View all vehicles
- Add a vehicle
- Edit a vehicle
- Delete a vehicle
- View service history
- Add a service record
- Edit a service record
- Delete a service record
- Show overdue services
- Show next service date
- Pagination
- Form validation
- API error messages

## Project Structure

```text
src/

├── components/
│   ├── VehicleForm.jsx
│   ├── EditVehicleForm.jsx
│   ├── ServiceHistory.jsx
│   └── ServiceRecordForm.jsx
│
├── services/
│   └── api.js
│
├── App.jsx
├── App.css
└── main.jsx