import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // You'll need to set up routing

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // For redirecting after login

  // ✅ Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);

    try {
      // ✅ Send login request to backend
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ⚠️ CRITICAL: Include cookies in request
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ Login successful - redirect to dashboard
        console.log("Login successful:", data.message);
        navigate("/dashboard"); // Redirect to your incident page
      } else {
        // ❌ Login failed
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#212529] text-primary-color p-4 font-primary">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>

      {/* Login Form Container */}
      <div className="relative z-10 bg-[#343A40] p-10 rounded-lg shadow-2xl w-full max-w-md border border-[#495057]">
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

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Username Input */}
          <div className="mb-5">
            <label
              className="block text-sm font-medium text-primary-color mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 h-12 bg-[#2C3034] rounded-md border border-[#495057] focus:outline-none focus:ring-1 focus:ring-[#DC3545] placeholder-[#ADB5BD] text-white"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Password Input with Toggle */}
          <div className="mb-5 relative">
            <label
              className="block text-sm font-medium text-primary-color mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 h-12 bg-[#2C3034] rounded-md border border-[#495057] focus:outline-none focus:ring-1 focus:ring-[#DC3545] placeholder-[#ADB5BD] text-white"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-[#ADB5BD] hover:text-white"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#DC3545] hover:bg-red-700 text-white font-bold h-14 text-lg py-3 px-4 rounded-md transition-colors duration-300 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;