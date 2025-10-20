import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaExclamationTriangle } from "react-icons/fa";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    // Main container with dark background
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#212529] text-[#F8F9FA] p-4 font-sans">
      {/* Subtle background texture/image with overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>

      {/* Centralized Login Form Container */}
      <div className="relative z-10 bg-[#343A40] p-10 rounded-lg shadow-2xl w-full max-w-md border border-[#495057]">

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-red-800 flex items-center justify-center">
            <FaExclamationTriangle size={50} className="text-red-300" />
          </div>
          <h1 className="text-3xl font-bold text-[#F8F9FA]">
            Incident Log System
          </h1>
          <p className="text-[#6C757D] mt-3">Welcome to Incident Log System</p>
        </div>

        <form>
          {/* Username Input */}
          <div className="mb-5">
            <label
              className="block text-sm font-medium text-[#F8F9FA] mb-2"
              htmlFor="username"
            >
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-3 h-12 bg-[#2C3034] rounded-md border border-[#495057] focus:outline-none focus:ring-1 focus:ring-[#DC3545] placeholder-[#ADB5BD]"
              placeholder="Enter your username or email"
            />
          </div>

          {/* Password Input with Toggle */}
          <div className="mb-5 relative">
            <label
              className="block text-sm font-medium text-[#F8F9FA] mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full p-3 h-12 bg-[#2C3034] rounded-md border border-[#495057] focus:outline-none focus:ring-1 focus:ring-[#DC3545] placeholder-[#ADB5BD]"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-[#ADB5BD] hover:text-white"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-[#F8F9FA]"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-[#0D6EFD] hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#DC3545] hover:bg-red-700 text-white font-bold h-14 text-lg py-3 px-4 rounded-md transition-colors duration-300 active:bg-red-800"
          >
            Login
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 text-center text-[#ADB5BD] text-sm">
        <p>© 2025 Fire Department Name. Version 1.0</p>
      </footer>
    </div>
  );
};

export default LoginPage;
