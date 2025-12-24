// File: src/features/dashboard/components/QuickActions.tsx
/**
 * What it does:
 * A "dumb" component that displays the navigation buttons.
 *
 * How it works:
 * - Uses 'useNavigate' for navigation (this is okay for
 * a presentational component, as it's UI logic).
 *
 * How it connects:
 * - 'DashboardPage.tsx' renders this component.
 */

import { useNavigate } from "react-router-dom";
import { FaPlus, FaList, FaUsers } from "react-icons/fa";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/incident/new")}
          className="flex-1 bg-[#0D6EFD] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center text-lg"
        >
          <FaPlus className="mr-2" /> Log New Incident
        </button>
        <button
          onClick={() => navigate("/incident-dashboard")}
          className="flex-1 bg-[#495057] hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center text-lg"
        >
          <FaList className="mr-2" /> View All Incidents
        </button>
        {/* 🌟 --- FIX --- 🌟 */}
        <button
          onClick={() => navigate("/crew-management")}
          className="flex-1 bg-[#495057] hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center text-lg"
        >
        {/* 🌟 --- END FIX --- 🌟 */}
          <FaUsers className="mr-2" /> Manage Crews
        </button>
      </div>
    </section>
  );
};

export default QuickActions;