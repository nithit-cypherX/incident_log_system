// File: src/components/ProtectedRoute.tsx
/**
 * What it does:
 * Protects routes that require authentication (Guide Part 7).
 *
 * How it works:
 * - Uses the 'useAuth' hook to get the 'isAuthenticated'
 * and 'isLoading' values from 'AuthContext'.
 * - If still loading, it shows a "Loading..." message.
 * - If NOT authenticated, it redirects to '/login'.
 * - If authenticated, it renders the 'children' (the page).
 *
 * How it connects:
 * - 'App.tsx' wraps all protected <Route> elements with this.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// It accepts 'children' (the page component)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#212529] text-white">
        <p>Loading...</p>
      </div>
    );
  }

  // 2. If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;