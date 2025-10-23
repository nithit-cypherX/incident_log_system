import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// ✅ FIX 1: The type 'React.PropsWithChildren' goes *here*.
// It describes the entire props object { children },
// not just the 'children' prop inside an object.
//
// ❌ WRONG: ({ children }: { children: React.PropsWithChildren })
// ✅ RIGHT: ({ children }: React.PropsWithChildren)
//
const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // ✅ Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/check-login", {
          credentials: "include", // Include cookies
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#212529] text-white">
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ FIX 2: Return children inside a Fragment (<></>).
  // With 'React.PropsWithChildren', the 'children' prop can
  // sometimes be 'undefined'.
  // A component is NOT allowed to return 'undefined'.
  // Wrapping it in a fragment makes it return 'null' instead,
  // which is perfectly valid and fixes the error!
  return <>{children}</>;
};

export default ProtectedRoute;