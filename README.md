Here is a **clean, complete, fully reconstructed `README.md`** with proper formatting (no truncation).
You can copy and paste it directly into your file.

---

# 🔥 FirePersona 5 – Incident Log System

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

> A comprehensive full-stack application for Fire Departments to manage incidents, personnel, equipment, and reporting in real time.

---

## 📖 Table of Contents

* [Overview](#-overview)
* [Key Features](#-key-features)
* [Tech Stack](#-tech-stack)
* [Architecture](#-architecture)
* [Database Schema](#-database-schema)
* [Getting Started](#-getting-started)
* [API Reference](#-api-reference)
* [Screenshots](#-screenshots)

---

## 🚒 Overview

**FirePersona 5** is an Incident Log System designed to digitize the workflow of emergency response teams.
It replaces paper logs with a modern, responsive web interface that allows Station Captains and Admins to:

1. **Log incidents** with geocoded location data
2. **Manage crews** and equipment availability
3. **Generate PDF reports** instantly for documentation and compliance
4. **Visualize operational data** in a real-time dashboard

---

## ✨ Key Features

### 📊 Interactive Dashboard

* Real-time incident statistics
* Active vs. Pending incident counts
* Charts powered by **Chart.js**
* Recent activity feed

### 📝 Advanced Incident Management

* **Geocoding:** Auto-converts address → GPS coordinates via OpenStreetMap (Nominatim)
* **Interactive Map View:** Built with **Leaflet**
* **Incident Details:** priority, type, timestamps, description
* **File Attachments:** upload images or documents

### 👨‍🚒 Resource Management (Crew & Equipment)

* **Personnel CRUD:** names, rank, on–duty status
* **Equipment CRUD:** vehicles, tools, equipment status
* **Assignments:** assign crew + vehicles to an incident

### 📄 One-Click Reporting

* Generate **A4 PDF reports** using `@react-pdf/renderer`
* Includes:

  * Incident summary
  * Crew list
  * Equipment list
  * Attachments section

---

## 🛠 Tech Stack

### 🔹 Frontend

* React (Vite)
* TypeScript
* Tailwind CSS
* React Context
* React Hook Form + Zod
* React-Leaflet
* @react-pdf/renderer

### 🔹 Backend

* Node.js
* Express.js
* MySQL (mysql2)
* Sessions (cookie-based)
* CORS

---

## 🏗 Architecture

This project uses a **Feature-Based Architecture** for separation and scalability:

```
src/
├── components/     # Reusable UI components
├── features/       # Each domain feature
│   ├── auth/
│   ├── crew/
│   ├── dashboard/
│   └── incident/
├── context/        # Authentication context
├── services/       # API services (axios)
└── lib/            # Helpers, formatters
```

---

## 🗄 Database Schema

The application uses a normalized MySQL schema with these core tables:

* **Users** – personnel info, rank, credentials
* **Incidents** – incident metadata, coordinates, status
* **Equipment** – vehicles and tools
* **Incident_Personnel** – many-to-many relationships for assigned crew
* **Incident_Equipment** – many-to-many relationships for assigned equipment
* **Attachments** – files uploaded per incident

---

## 🚀 Getting Started

### 🧩 Prerequisites

* Node.js **16+**
* MySQL Server

---

### 1️⃣ Database Setup

Import the SQL schema:

```bash
mysql -u root -p < database.sql
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install

# Create .env using .env.example
# Add DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

node server.js
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access the app at:

👉 [http://localhost:5173](http://localhost:5173)

---

## 📡 API Reference

### 🔐 Authentication

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| POST   | /api/v1/login       | Login user       |
| GET    | /api/v1/check-login | Validate session |

### 🚒 Incidents

| Method | Endpoint                 | Description          |
| ------ | ------------------------ | -------------------- |
| GET    | /api/v1/incidents        | Get all incidents    |
| POST   | /api/v1/incidents/search | Search for incidents |
| POST   | /api/v1/incidents/create | Create new incident  |
| PUT    | /api/v1/incidents/:id    | Update incident      |

### 🧑‍🚒 Resources

| Method | Endpoint          | Description   |
| ------ | ----------------- | ------------- |
| GET    | /api/v1/personnel | Get crew list |
| GET    | /api/v1/equipment | Get equipment |

### 📊 Dashboard

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| GET    | /api/v1/dashboard/stats | Aggregated dashboard stats |

---

## 📸 Screenshots

### Dashboard

<img src="https://github.com/user-attachments/assets/af96caba-4b58-4571-ba2d-d3215735ec2c" width="800" />

### Incident Log & Search

<img src="https://github.com/user-attachments/assets/75efe00a-fc34-40f9-813e-8f0f809c576e" width="800" />

### Incident Details & Map

<img src="https://github.com/user-attachments/assets/16c09929-783e-4e2e-96c4-6745d9638eb8" width="800" />

### Crew & Equipment Management

<img src="https://github.com/user-attachments/assets/1a56ae1d-f5cb-4701-92ef-c991897a3067" width="800" />

---

© 2025 FirePersona 5 — Built for modern emergency services.

---

If you want, I can also:
✅ Format it to look more professional
✅ Add badges, diagrams, or a folder-tree graphic
✅ Add installation GIFs
Just tell me!
