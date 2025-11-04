// File: src/components/layouts/MainLayout.tsx
/**
 * What it does:
 * Provides the main layout for the authenticated application.
 *
 * How it works:
 * - It renders the 'NavBar' at the top, the 'Footer' at the bottom,
 * and the main page content in the middle.
 * - '<Outlet>' from 'react-router-dom' renders the specific page
 * (e.g., DashboardPage, IncidentDetailsPage).
 *
 * How it connects:
 * - 'App.tsx' uses this as the layout for all protected routes.
 * - 'NavBar' and 'Footer' components are now part of this layout.
 */

import { Outlet } from "react-router-dom";
import NavBar from "./NavBar"; // Contains nav logic
import Footer from "./Footer"; // Contains footer content

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#212529] text-[#F8F9FA] font-primary flex flex-col">
      <NavBar />
      <main className="flex-grow p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* All page content (Dashboard, Details, etc.) renders here */}
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;