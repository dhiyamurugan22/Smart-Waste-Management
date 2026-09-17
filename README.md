♻️ Smart Waste Management System
 
A Smart Waste Management System is a web-based application designed to improve waste collection and management using IoT technology. The system enables authorities to monitor smart bins, manage collection routes, and track vehicle dispatch efficiently.
 
📌 Project Overview
 
Traditional waste management systems often depend on manual monitoring. This can lead to overflowing bins, delayed collection, and inefficient waste disposal.
 
The Smart Waste Management System provides a centralized platform where:
 
- 🗑️ Waste bins can be monitored based on real-time IoT sensor fill levels.
- 🚛 Authorities can assign and manage collection routes for drivers.
- 📍 Waste bin locations and telemetry are tracked on interactive maps.
- 📊 Authorities can analyze waste generation metrics and environmental impacts.
 
🎯 Objectives
 
- Reduce improper waste disposal.
- Improve waste collection efficiency through IoT automation.
- Help authorities monitor bin fill levels and maintenance requirements.
- Reduce overflowing waste bins with real-time alerts.
- Maintain digital records of bin telemetry and collection activities.
- Promote a cleaner and healthier environment.
 
✨ Key Features
 
🏢 Authority/Admin & Driver Operations
 
Authorities and drivers can:
 
- Monitor real-time bin statuses (Fill Level, Temperature, Battery).
- View live sensor maps with location pins.
- Assign and execute collection tasks for drivers.
- Trigger simulated IoT telemetry updates.
- Track environmental impact analytics (CO₂ offset, waste diverted).
 
🗑️ Waste Monitoring
 
The system maintains real-time information such as:
 
- Bin ID
- Location
- Fill level (%)
- Status (EMPTY, LOW, MEDIUM, FULL, OVERFLOWING)
- Battery level & sensor temperature
- Last collection timestamp
 
🏗️ System Architecture
 
                  ┌──────────────────┐
                  │  Authority/Driver│
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  React Frontend  │
                  └────────┬─────────┘
                           │
                        REST API
                           │
                           ▼
                  ┌──────────────────┐
                  │  Spring Boot     │
                  │     Backend      │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │     MongoDB      │
                  │    Database      │
                  └──────────────────┘
 
🛠️ Technology Stack
 
Frontend
 
- React.js
- HTML5
- CSS3
- JavaScript
- Axios
 
Backend
 
- Java
- Spring Boot
- Spring Web
- Spring Data MongoDB
- REST API
 
Database
 
- MongoDB
 
Development Tools
 
- Visual Studio Code
- IntelliJ IDEA / Eclipse
- MongoDB Compass
- Git
- GitHub
 
📂 Project Structure
 
smart-waste-management/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   └── src/
│       └── main/
│           └── java/
│               └── com/
│                   └── smartwaste/
│                       ├── config/
│                       ├── controller/
│                       ├── service/
│                       ├── repository/
│                       ├── model/
│                       └── SmartWasteApplication.java
│
├── README.md
└── .gitignore
 
🔄 System Workflow
 
IoT Sensors / Authorities
  │
  ▼
Monitor Fill Levels
  │
  ▼
Automated Critical Bin Detection
  │
  ▼
Task Assigned to Driver
  │
  ▼
Waste Collection Executed
  │
  ▼
Bin Reset & Analytics Updated
 
🗃️ Main Data Collections
 
Waste Bins
 
binId
location
currentFillLevel
status
temperature
batteryLevel
lastCollectedAt
 
Collection Tasks
 
taskId
assignedDriverName
vehicleNumber
targetZone
status
assignedAt
completedAt
 
🌱 Benefits
 
- Automated route optimization
- Faster waste collection response
- Real-time IoT sensor telemetry
- Reduced fuel consumption & CO₂ emissions
- Improved municipal resource allocation
 
🔗 API Communication
 
The React frontend communicates with the Spring Boot backend through REST APIs:
 
GET    /api/bins
POST   /api/bins
POST   /api/bins/{id}/empty
 
GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/{id}/status
 
GET    /api/analytics/overview
POST   /api/iot/simulate
 
👥 Team
 
Smart Waste Management System
 
Developed as an academic software engineering project to provide a technology-driven solution for efficient waste management.
 
📄 License
 
This project is developed for educational and academic purposes.
 