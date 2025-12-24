// File: src/main.tsx
/**
 * What it does:
 * The main entry point for the React application.
 *
 * How it works:
 * - It imports the 'AuthProvider' from 'context/AuthContext.tsx'.
 * - It wraps the entire 'App' component in 'AuthProvider'
 * so that all components can access the auth state.
 * - It also wraps the 'App' in 'Router' (BrowserRouter).
 *
 * How it connects:
 * - This file boots up the entire application.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App.tsx";
import "./index.css"; // Keep your global styles
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>
);