// src/pages/Dashboard.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaExclamationTriangle, // We still need this
  FaPlus,
  FaList,
  FaUsers,
  FaSpinner,
} from 'react-icons/fa';
// Import the new external component
import IncidentStatistics from '../components/IncidentStatistics';
import NavBar from '../components/NavBar';

// --- Define types for our API data (No change) ---
type IncidentTypeData = {
  incident_type: string;
  count: number;
};

type DashboardStats = {
  activeIncidents: number;
  pendingIncidents: number;
  incidentsToday: number;
  crewsAvailable: number;
  equipmentInUse: number;
  totalIncidents: number;
  incidentTypeBreakdown: IncidentTypeData[];
};

// --- 🌟 Sub-component 2: StatCard (MODIFIED) ---
type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  valueColor?: string;
  isLoading: boolean; // 1. Add isLoading prop
  hasError: boolean; // 2. Add hasError prop
};

const StatCard = ({
  title,
  value,
  description,
  valueColor = 'text-white',
  isLoading,
  hasError,
}: StatCardProps) => {
  // 3. Add logic to render the correct content inside the card
  const renderValue = () => {
    if (isLoading) {
      // Use text-5xl to make it large like the number
      return <FaSpinner className="animate-spin text-5xl mt-2" />;
    }
    if (hasError) {
      return (
        <FaExclamationTriangle className="text-5xl mt-2 text-red-500" />
      );
    }
    // If not loading and no error, show the value
    return (
      <p className={`text-6xl font-bold mt-2 ${valueColor}`}>{value}</p>
    );
  };

  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg">
      <h3 className="text-sm font-medium text-[#ADB5BD] uppercase">
        {title}
      </h3>
      {renderValue()} {/* 4. Call the render function */}
      <p className="text-[#ADB5BD] mt-2">{description}</p>
    </div>
  );
};

// --- Sub-component 3: QuickActions (No change) ---
const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/incident/new')}
          className="flex-1 bg-[#0D6EFD] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center text-lg"
        >
          <FaPlus className="mr-2" /> Log New Incident
        </button>
        <button
          onClick={() => navigate('/incident-dashboard')}
          className="flex-1 bg-[#495057] hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center text-lg"
        >
          <FaList className="mr-2" /> View All Incidents
        </button>
        <button
          onClick={() => {
            /* No page for this yet */
          }}
          className="flex-1 bg-[#495057] hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center text-lg"
        >
          <FaUsers className="mr-2" /> Manage Crews
        </button>
      </div>
    </section>
  );
};

// --- Main Page Component (Export Default) ---
const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. Add useEffect to fetch data on load (No change)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/v1/dashboard/stats',
          {
            credentials: 'include', // Include cookies if needed
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const data: DashboardStats = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // Empty array means this runs once on component mount

  // 🌟 6. REMOVED the old 'statValue' helper function

  return (
    <div className="min-h-screen bg-[#212529] text-[#F8F9FA] font-sans flex flex-col">
      <NavBar />

      <main className="flex-grow p-8 overflow-y-auto space-y-8">
        {/* 7. Show error message if fetch failed (No change) */}
        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded-md text-red-200">
            <strong>Error:</strong> Failed to load dashboard data. {error}
          </div>
        )}

        {/* 🌟 8. Top Stat Cards (UPDATED) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StatCard
            title="Active Incidents"
            value={stats?.activeIncidents ?? 0}
            isLoading={loading}
            hasError={!!error}
            description="Currently ongoing"
            valueColor="text-red-500"
          />
          <StatCard
            title="Pending Incidents"
            value={stats?.pendingIncidents ?? 0}
            isLoading={loading}
            hasError={!!error}
            description="Awaiting closure or review"
            valueColor="text-yellow-500"
          />
        </div>

        {/* Quick Actions (No change) */}
        <QuickActions />

        {/* Statistics Grid (No change) */}
        <IncidentStatistics
          incidentTypeData={stats?.incidentTypeBreakdown}
          incidentsTodayData={stats?.incidentsToday}
          loading={loading}
        />
      </main>
    </div>
  );
};

export default DashboardPage;