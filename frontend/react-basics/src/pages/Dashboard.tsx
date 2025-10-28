import React from 'react';
// Import icons for the components defined in this file
import { 
  FaFire, FaBell, FaExclamationTriangle, FaUserCircle, FaChevronDown, 
  FaPlus, FaList, FaUsers 
} from 'react-icons/fa';
// Import the new external component
import IncidentStatistics from '../components/IncidentStatistics';
import NavBar from "../components/NavBar";

// --- Sub-component 2: StatCard ---
type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  valueColor?: string;
};
const StatCard = ({ title, value, description, valueColor = 'text-white' }: StatCardProps) => {
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg">
      <h3 className="text-sm font-medium text-[#ADB5BD] uppercase">{title}</h3>
      <p className={`text-6xl font-bold mt-2 ${valueColor}`}>{value}</p>
      <p className="text-[#ADB5BD] mt-2">{description}</p>
    </div>
  );
};

// --- Sub-component 3: QuickActions ---
const QuickActions = () => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="flex gap-4">
        <button className="flex-1 bg-[#0D6EFD] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center text-lg">
          <FaPlus className="mr-2" /> Log New Incident
        </button>
        <button className="flex-1 bg-[#495057] hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center text-lg">
          <FaList className="mr-2" /> View All Incidents
        </button>
        <button className="flex-1 bg-[#495057] hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center text-lg">
          <FaUsers className="mr-2" /> Manage Crews
        </button>
      </div>
    </section>
  );
};

// --- Main Page Component (Export Default) ---
const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#212529] text-[#F8F9FA] font-sans flex flex-col">
      <NavBar />
      
      <main className="flex-grow p-8 overflow-y-auto space-y-8">
        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StatCard 
            title="Active Incidents"
            value={7}
            description="Currently ongoing"
            valueColor="text-red-500"
          />
          <StatCard 
            title="Unread Alerts"
            value={3}
            description="New notifications awaiting review"
            valueColor="text-yellow-500"
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Statistics Grid */}
        <IncidentStatistics />

      </main>
    </div>
  );
};

export default DashboardPage;