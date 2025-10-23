import React from 'react';
// Import icons for the components defined in this file
import { 
  FaFire, FaBell, FaExclamationTriangle, FaUserCircle, FaChevronDown, 
  FaPlus, FaList, FaUsers 
} from 'react-icons/fa';
// Import the new external component
import IncidentStatistics from '../components/IncidentStatistics';

// --- Sub-component 1: DashboardHeader ---
const DashboardHeader = () => {
  return (
    <header className="bg-[#343A40] text-[#F8F9FA] p-4 flex items-center justify-between border-b border-[#495057]">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-md bg-red-600 flex items-center justify-center mr-3">
          <FaFire size={24} />
        </div>
        <h1 className="text-xl font-bold">Incident Log System</h1>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-[#ADB5BD] hover:text-white">
          <FaBell size={20} />
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </button>
        <button className="relative text-[#ADB5BD] hover:text-white">
          <FaExclamationTriangle size={20} />
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            1
          </span>
        </button>
        <div className="flex items-center gap-2 text-white cursor-pointer">
          <FaUserCircle size={28} />
          <span>John Doe</span>
          <FaChevronDown size={14} />
        </div>
      </div>
    </header>
  );
};

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
      <DashboardHeader />
      
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