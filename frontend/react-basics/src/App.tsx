// File: src/App.tsx
/**
 * What it does:
 * This is the main router for the application.
 *
 * How it works:
 * - Uses 'react-router-dom' to define all routes.
 * - Implements the 'Layout' pattern from the guide (Part 7).
 * - 'AuthLayout' wraps public routes like '/login'.
 * - 'MainLayout' wraps all protected routes.
 * - 'ProtectedRoute' component guards the 'MainLayout'.
 * - It imports the "Page" components from the 'features' folders.
 *
 * How it connects:
 * - This is the main component rendered by 'main.tsx'.
 * - It orchestrates which page and layout to show based on the URL.
 */
import "./App.css";
import { Routes, Route, Navigate }from "react-router-dom";

// Layouts
import MainLayout from "./components/layouts/MainLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// --- Page Components ---
// We import them from their new 'features' folders
// (We will create these files in Part 2)
import LoginPage from "./features/auth/pages/LoginPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import IncidentDashboardPage from "./features/incident/pages/IncidentDashboardPage";
import IncidentDetailsPage from "./features/incident/pages/IncidentDetailsPage";
import IncidentFormPage from "./features/incident/pages/IncidentFormPage";
import CrewManagementPage from "./features/crew/pages/CrewManagementPage";

function App() {
  return (
    <Routes>
      {/* 1. Public Routes (e.g., Login) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* 2. Protected Routes (The main app) */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/incident-dashboard" element={<IncidentDashboardPage />} />
        
        {/* CREATE incident */}
        <Route path="/incident/new" element={<IncidentFormPage />} />
        
        {/* EDIT incident */}
        <Route path="/incident/edit/:id" element={<IncidentFormPage />} />
        
        {/* VIEW incident details */}
        <Route path="/incident/:id" element={<IncidentDetailsPage />} />

        {/* Crew Management page */}
        <Route path="/crew-management" element={<CrewManagementPage />} />
        
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
      
      {/* 3. 404/Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      
    </Routes>
  );
}

export default App;