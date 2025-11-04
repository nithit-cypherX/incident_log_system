// File: src/features/dashboard/pages/DashboardPage.tsx
/**
 * What it does:
 * The "smart" page component for the main dashboard.
 *
 * How it works:
 * - Follows the "Smart Component" pattern (Guide Part 2).
 * - 'useEffect' to fetch data from 'dashboardService.getStats'.
 * - Manages 'stats', 'loading', and 'error' state.
 * - Passes data down to the "dumb" components:
 * - <StatCard>
 * - <QuickActions>
 * - <IncidentStatistics>
 *
 * How it connects:
 * - 'App.tsx' routes '/dashboard' to this page.
 * - This page is the "container" for the entire dashboard.
 */

import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";
import type { DashboardStats } from "../types/dashboard.types";
import StatCard from "../components/StatCard";
import QuickActions from "../components/QuickActions";
import IncidentStatistics from "../components/IncidentStatistics";

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. Add useEffect to fetch data on load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // Empty array means this runs once on component mount

  return (
    // 'MainLayout.tsx' already provides padding, so
    // we just return the content.
    <div className="space-y-8">
      {/* 7. Show error message if fetch failed */}
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded-md text-red-200">
          <strong>Error:</strong> Failed to load dashboard data. {error}
        </div>
      )}

      {/* 8. Top Stat Cards */}
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

      {/* Quick Actions */}
      <QuickActions />

      {/* Statistics Grid */}
      <IncidentStatistics
        incidentTypeData={stats?.incidentTypeBreakdown}
        incidentsTodayData={stats?.incidentsToday}
        loading={loading}
      />
    </div>
  );
};

export default DashboardPage;