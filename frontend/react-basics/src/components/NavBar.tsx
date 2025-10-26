import React from 'react';
import { FaFire, FaBell } from 'react-icons/fa'; // Icons for logo and notifications

const NavBar = () => {
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
      <div className="flex items-center space-x-6 text-[#A0B0C0] font-medium">
        <a href="#" className="hover:text-white transition-colors">
          Dashboard
        </a>
        <a href="#" className="text-white font-semibold border-b-2 border-[#1D63FF] pb-1">
          Incident Log
        </a>
        {/* You can add these later
        <a href="#" className="hover:text-white transition-colors">Resources</a>
        <a href="#" className="hover:text-white transition-colors">Training</a>
        <a href="#" className="hover:text-white transition-colors">Reports</a>
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