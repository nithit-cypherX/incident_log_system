import React from 'react';
import { FaFire, FaBell } from 'react-icons/fa'; // Icons for logo and notifications
// 🌟 1. Import Link and useLocation from React Router
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  // 🌟 2. Get the current location object
  const location = useLocation();
  const currentPath = location.pathname; // This gives us the current URL path (e.g., "/dashboard")

  // 🌟 3. Define the different styles for our links
  const baseLinkClass = "hover:text-white transition-colors";
  const activeLinkClass = "text-white font-semibold border-b-2 border-[#1D63FF] pb-1";
  const inactiveLinkClass = "text-[#A0B0C0] font-medium";
  
  /**
   * 🌟 4. Helper function to check if a path is active.
   * We use 'startsWith' so that a path like "/incident/1"
   * will still count as being part of the "/incident-dashboard" section.
   */
  const isPathActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath === path;
    }
    // Check for /incident-dashboard, /incident/new, or /incident/:id
    return currentPath.startsWith("/incident");
  }

  return (
    // Main navbar container
    <nav className="w-full bg-[#1A2C3D] text-white p-4 flex items-center justify-between border-b border-[#34404E]">
      
      {/* Left Side: Logo and Title */}
      <div className="flex items-center space-x-3">
        {/* Logo */}
        <div className="bg-red-600 p-2 rounded-lg">
          <FaFire size={20} />
        </div>
        <span className="text-xl font-bold">FirePersona 5</span>
      </div>

      {/* Middle: Navigation Links */}
      <div className="flex items-center space-x-6">
        
        {/* 🌟 5. Use <Link> instead of <a> and set classes dynamically */}
        <Link 
          to="/dashboard" 
          className={`
            ${baseLinkClass} 
            ${currentPath === '/dashboard' ? activeLinkClass : inactiveLinkClass}
          `}
        >
          Dashboard
        </Link>
        
        <Link 
          to="/incident-dashboard" 
          className={`
            ${baseLinkClass} 
            ${isPathActive('/incident') ? activeLinkClass : inactiveLinkClass}
          `}
        >
          Incident Log
        </Link>
        
        {/* You can add these later
        <Link to="#" className={`${baseLinkClass} ${inactiveLinkClass}`}>Resources</Link>
        <Link to="#" className={`${baseLinkClass} ${inactiveLinkClass}`}>Training</Link>
        <Link to="#" className={`${baseLinkClass} ${inactiveLinkClass}`}>Reports</Link>
        */}
      </div>

      {/* Right Side: Notifications and Profile */}
      <div className="flex items-center space-x-5">
        {/* Notification Bell */}
        <button className="text-[#A0B0C0] hover:text-white transition-colors">
          <FaBell size={20} />
        </button>

        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-500 overflow-hidden">
          {/* Placeholder image. Replace with your user's profile picture. */}
          <img 
            src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png" 
            alt="User profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;