import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import IncidentDashboard from "./pages/IncidentDashboard";
import NewIncidentPage from "./pages/NewIncidentPage";
import Dashboard from "./pages/Dashboard";
import IncidentDetail from "./pages/IncidentDetailsPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/incident-dashboard"
              element={
                <ProtectedRoute>
                  <IncidentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/incident/new"
              element={
                <ProtectedRoute>
                  <NewIncidentPage />
                </ProtectedRoute>
              }
            />
            
            {/* 🌟 NEW: This is the dynamic route for the details page */}
            {/* It will match /incident/1, /incident/2, etc. */}
            <Route
              path="/incident/:id"
              element={
                <ProtectedRoute>
                  <IncidentDetail />
                </ProtectedRoute>
              }
            />

            {/* Redirect root to the main dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 or redirect for any other unknown path */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;