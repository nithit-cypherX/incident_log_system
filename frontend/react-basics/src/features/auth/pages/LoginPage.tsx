// File: src/features/auth/pages/LoginPage.tsx
/**
 * What it does:
 * This is the "smart" page component for the login route.
 * It handles the business logic for logging in.
 *
 * How it works:
 * - Renders the "dumb" <LoginForm> component.
 * - Uses the 'useAuth' hook to get the 'login' function.
 * - Uses 'useNavigate' to redirect after success.
 * - 'handleLogin' is the function passed to <LoginForm>. It calls
 * the 'login' function from context and handles success/error.
 *
 * How it connects:
 * - 'App.tsx' routes '/login' to this page.
 * - This page renders <LoginForm> and provides its logic.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import { LoginForm } from "../components/LoginForm";
import type { LoginFormData } from "../validators/loginSchema";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // This is the "smart" logic
  const handleLogin = async (data: LoginFormData) => {
    setError("");
    setLoading(true);
    try {
      // Call the login function from AuthContext
      await login(data.username, data.password);
      // On success, navigate to the dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setLoading(false);
      // 'apiClient' (or the service) will throw an error
      setError(err.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    // This UI is from your original 'LoginPage.tsx'
    // It's the wrapper around the form
    <div className="relative z-10 bg-[#343A40] p-10 rounded-lg shadow-2xl w-full max-w-md border border-[#495057] mx-auto">
      {/* Logo and Title */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-red-800 flex items-center justify-center">
          <FaExclamationTriangle size={50} className="text-red-300" />
        </div>
        <h1 className="text-3xl font-bold text-primary-color">
          Incident Log System
        </h1>
        <p className="text-[#6C757D] mt-3">Welcome back! Please login to continue</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-5 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* The "dumb" form component */}
      <LoginForm onSubmit={handleLogin} isSubmitting={loading} />
    </div>
  );
};

export default LoginPage;