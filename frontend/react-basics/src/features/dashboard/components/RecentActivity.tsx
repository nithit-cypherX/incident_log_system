// File: src/features/dashboard/components/RecentActivity.tsx
/**
 * What it does:
 * Displays a feed of recent incident activity.
 *
 * How it works:
 * - This is a "smart-ish" feature component. It is
 * self-contained and fetches its own data.
 * - Uses 'useEffect' to call 'dashboardService.getRecentActivity'.
 * - Manages its own 'loading' and 'error' state.
 *
 * How it connects:
 * - Rendered by 'IncidentStatistics.tsx'.
 */

import { useState, useEffect } from "react";
import {
  FaFire,
  FaCheckCircle,
  FaBell,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { dashboardService } from "../services/dashboardService";
import type { Activity } from "../types/dashboard.types";
import { formatDate } from "../../../lib/utils"; // Use global helper

// 3. Helper to get icon based on status
const getIcon = (status: "active" | "pending" | "closed") => {
  switch (status) {
    case "active":
      return <FaFire className="text-red-500" />;
    case "pending":
      return <FaBell className="text-yellow-500" />;
    case "closed":
      return <FaCheckCircle className="text-green-500" />;
    default:
      return <FaBell className="text-gray-500" />;
  }
};

const RecentActivity = () => {
  // 4. Add state for activities, loading, and error
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. Fetch data on component load
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getRecentActivity();
        setActivities(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg h-64">
      <h4 className="text-md font-semibold text-white mb-4">Recent Activity & Updates</h4>

      {/* 6. Handle loading and error states */}
      {loading && (
        <div className="flex items-center justify-center h-full text-secondary-color">
          <FaSpinner className="animate-spin mr-2" /> Loading...
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center h-full text-red-400">
          <FaExclamationTriangle className="mb-2" />
          <span className="text-sm">Failed to load activity</span>
        </div>
      )}

      {/* 7. Render real data */}
      {!loading && !error && (
        <ul className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <li key={activity.id} className="flex items-center gap-3">
                <span className="flex-shrink-0">{getIcon(activity.status)}</span>
                <span className="text-sm text-[#ADB5BD]">
                  {/* Create a useful message from the data */}
                  <strong>{activity.incident_code}</strong> ({activity.status})
                  <span className="block text-xs">{formatDate(activity.updated_at)}</span>
                </span>
              </li>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-secondary-color">
              No recent activity.
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;