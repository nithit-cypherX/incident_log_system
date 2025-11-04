// File: src/components/layouts/NavBar.tsx
/**
 * What it does:
 * Renders the top navigation bar.
 *
 * How it works:
 * - Uses 'Link' and 'useLocation' from 'react-router-dom' to
 * navigate and highlight the active link (Guide Part 7).
 * - 'isPathActive' helper determines the active link.
 * - It can use the 'useAuth' hook to get the user's name
 * and the 'logout' function.
 *
 * How it connects:
 * - This component is rendered inside 'MainLayout.tsx'.
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFire, FaBell, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth"; // Import the hook

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Get auth state and functions
  const { user, logout, isLoading } = useAuth();

  const baseLinkClass = "hover:text-white transition-colors";
  const activeLinkClass =
    "text-white font-semibold border-b-2 border-[#1D63FF] pb-1";
  const inactiveLinkClass = "text-[#A0B0C0] font-medium";

  const isPathActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath === path;
    }
    // Check for /incident-dashboard, /incident/new, or /incident/:id
    return currentPath.startsWith("/incident");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <nav className="w-full bg-[#1A2C3D] text-white p-4 flex items-center justify-between border-b border-[#34404E]">
      {/* Left Side: Logo and Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-red-600 p-2 rounded-lg">
          <FaFire size={20} />
        </div>
        <span className="text-xl font-bold">FirePersona 5</span>
      </div>

      {/* Middle: Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link
          to="/dashboard"
          className={`${baseLinkClass} ${
            currentPath === "/dashboard" ? activeLinkClass : inactiveLinkClass
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/incident-dashboard"
          className={`${baseLinkClass} ${
            isPathActive("/incident") ? activeLinkClass : inactiveLinkClass
          }`}
        >
          Incident Log
        </Link>
      </div>

      {/* Right Side: Notifications and Profile */}
      <div className="flex items-center space-x-5">
        <button className="text-[#A0B0C0] hover:text-white transition-colors">
          <FaBell size={20} />
        </button>

        {/* Show user name if available */}
        {!isLoading && user && (
          <span className="text-sm text-white">Welcome, {user.username}</span>
        )}

        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-500 overflow-hidden">
          <img
            src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png"
            alt="User profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Logout Button */}
        {!isLoading && user && (
          <button
            onClick={handleLogout}
            className="text-[#A0B0C0] hover:text-red-500 transition-colors"
            title="Logout"
          >
            <FaSignOutAlt size={20} />
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;