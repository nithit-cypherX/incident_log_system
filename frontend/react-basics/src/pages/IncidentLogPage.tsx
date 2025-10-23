import React, { useState } from 'react';
import Header from '../components/Header'; // Reusable Header
import StatusBadge from '../components/StatusBadge'; // Reusable Badge
import { FaPlus, FaSearch, FaRedo, FaEye, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

// --- Reusable Filter Dropdown ---
type FilterDropdownProps = {
  label: string;
  children: React.ReactNode;
};

const FilterDropdown = ({ label, children }: FilterDropdownProps) => (
  <div>
    <label className="block text-xs font-medium text-secondary-color mb-1">{label}</label>
    <select className="w-full p-2 h-11 bg-[#343A40] rounded-md border border-[#495057] focus:outline-none focus:ring-2 focus:ring-[#DC3545]">
      {children}
    </select>
  </div>
);

// --- Mock Data for the Table UI ---
// In a real app, this data would come from your backend
const mockIncidents = [
  { id: 'INC-2023-00123', type: 'Fire', date: '2023-10-26 14:30', address: '123 Main St, Anytown', status: 'Active', crew: 'Engine 1', priority: 'High' },
  { id: 'INC-2023-00122', type: 'EMS', date: '2023-10-26 11:15', address: '456 Oak Ave, Sector 4', status: 'Closed', crew: 'Medic 2', priority: 'Medium' },
  { id: 'INC-2023-00121', type: 'Rescue', date: '2023-10-25 09:05', address: '789 Pine Ln, Downtown', status: 'Pending', crew: 'Rescue 1', priority: 'Medium' },
  { id: 'INC-2023-00120', type: 'HAZMAT', date: '2023-10-24 17:45', address: '101 Industrial Pkwy', status: 'Closed', crew: 'HAZMAT 1', priority: 'Low' },
];

// --- Main Page Component ---
const IncidentLogPage = () => {
  // State to manage sorting (for UI icon display)
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

  // Helper function to render the correct sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="inline ml-1 opacity-30" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <FaSortUp className="inline ml-1" />;
    }
    return <FaSortDown className="inline ml-1" />;
  };

  return (
    <div className="min-h-screen bg-[#212529] text-primary-color font-primary flex flex-col">
      <Header title="Fire Incident Log" />
      
      <main className="flex-grow p-8 overflow-y-auto">
        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto bg-[#2C3034] p-6 rounded-lg shadow-lg">
          
          {/* A. Page Title & "Log New Incident" Button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Incident Log</h2>
            <button className="bg-[#DC3545] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center transition-colors">
              <FaPlus className="mr-2" />
              Log New Incident
            </button>
          </div>

          {/* B. Search and Filter Controls */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-secondary-color" />
              </div>
              <input
                type="text"
                placeholder="Search Incidents (ID, Address, Keyword...)"
                className="w-full p-3 h-12 pl-10 bg-[#343A40] rounded-md border border-[#495057] focus:outline-none focus:ring-2 focus:ring-[#DC3545] placeholder-[#ADB5BD]"
              />
            </div>
            {/* Filter Panel */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <FilterDropdown label="Status">
                <option>All</option>
                <option>Active</option>
                <option>Closed</option>
                <option>Pending</option>
              </FilterDropdown>
              <FilterDropdown label="Incident Type">
                <option>All</option>
                <option>Fire</option>
                <option>EMS</option>
                <option>Rescue</option>
              </FilterDropdown>
              <FilterDropdown label="Date Range">
                <option>All Time</option>
                <option>Today</option>
                <option>Last 7 Days</option>
              </FilterDropdown>
              <FilterDropdown label="Assigned Crew">
                <option>All</option>
                <option>Engine 1</option>
                <option>Medic 2</option>
              </FilterDropdown>
              <FilterDropdown label="Priority">
                <option>All</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </FilterDropdown>
              <div className="flex items-end">
                <button className="w-full p-2 h-11 bg-transparent text-link-color hover:bg-blue-900/20 font-semibold rounded-md flex items-center justify-center transition-colors">
                  <FaRedo className="mr-2 text-sm" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* C. Incident List Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              {/* Table Header */}
              <thead className="bg-[#3A3F44]">
                <tr>
                  <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">Incident ID {getSortIcon('id')}</th>
                  <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">Type {getSortIcon('type')}</th>
                  <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">Date/Time {getSortIcon('date')}</th>
                  <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">Address {getSortIcon('address')}</th>
                  <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">Status {getSortIcon('status')}</th>
                  <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">Crew {getSortIcon('crew')}</th>
                  <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">Priority {getSortIcon('priority')}</th>
                  <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {mockIncidents.map((incident) => (
                  <tr key={incident.id} className="border-b border-[#495057] hover:bg-[#3A3F44] transition-colors cursor-pointer">
                    <td className="p-3 text-sm">{incident.id}</td>
                    <td className="p-3 text-sm">{incident.type}</td>
                    <td className="p-3 text-sm">{incident.date}</td>
                    <td className="p-3 text-sm">{incident.address}</td>
                    <td className="p-3 text-sm">
                      <StatusBadge text={incident.status} type={incident.status.toLowerCase()} />
                    </td>
                    <td className="p-3 text-sm">{incident.crew}</td>
                    <td className="p-3 text-sm">
                      <StatusBadge text={incident.priority} type={incident.priority.toLowerCase()} />
                    </td>
                    <td className="p-3 text-sm text-center text-secondary-color">
                      <FaEye className="hover:text-white" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6 text-sm">
            <span className="text-secondary-color">Showing 1-4 of 4 Incidents</span>
            <div className="flex gap-2">
              <button className="py-2 px-4 bg-[#343A40] rounded-md hover:bg-[#495057] disabled:opacity-50" disabled>Previous</button>
              <button className="py-2 px-4 bg-[#343A40] rounded-md hover:bg-[#495057] disabled:opacity-50" disabled>Next</button>
            </div>
          </div>

        </div>
      </main>
      
      {/* Footer is handled by App.tsx, so no need to add it here */}
    </div>
  );
};

export default IncidentLogPage;