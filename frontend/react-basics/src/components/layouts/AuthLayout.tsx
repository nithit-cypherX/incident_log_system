// File: src/components/layouts/AuthLayout.tsx
/**
 * What it does:
 * Provides a layout wrapper for "authentication" pages (like Login).
 *
 * How it works:
 * - It renders a simple centered layout.
 * - 'react-router-dom's <Outlet> component renders the
 * actual page (e.g., LoginPage) inside this layout.
 *
 * How it connects:
 * - 'App.tsx' uses this in its <Route> definition for '/login'.
 */

import { Outlet } from "react-router-dom";
import Footer from "./Footer"; // We can reuse the footer

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#212529] text-primary-color p-4 font-primary">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>

      {/* Page content (e.g., LoginPage) will be rendered here */}
      <main className="relative z-10 w-full">
        <Outlet />
      </main>

      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default AuthLayout;