// File: src/hooks/useAuth.ts
/**
 * What it does:
 * Creates a simple 'useAuth' hook to access the AuthContext.
 *
 * How it works:
 * - It's a standard pattern from the guide (Part 5).
 * - It uses 'useContext' and throws an error if the context
 * is not available (which means you forgot to wrap your
 * app in <AuthProvider>).
 *
 * How it connects:
 * - Any component that needs auth info (like 'ProtectedRoute'
 * or 'NavBar') will call 'useAuth()' instead of
 * 'useContext(AuthContext)'.
 */
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};