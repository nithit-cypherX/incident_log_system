import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NewIncidentPage from "./pages/NewIncidentPage";
import Footer from "./components/Footer";
import IncidentDetailsPage from "./pages/IncidentDetailsPage";

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
            {/* Redirect root to incident-details */}
            <Route path="/incident-detail" element={<IncidentDetailsPage />} />
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