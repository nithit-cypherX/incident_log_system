import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NewIncidentPage from "./pages/NewIncidentPage";
import IncidentDashboard from "./pages/IncidentDashboard"
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            {/* <Route
              path="/new-incident"
              element={
                <ProtectedRoute>
                  <NewIncidentPage />
                </ProtectedRoute>
              }
            /> */}
            <Route path="/new-incident" element={<NewIncidentPage />} />
            
            <Route path="/incident-dashboard" element={<IncidentDashboard />} />

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;