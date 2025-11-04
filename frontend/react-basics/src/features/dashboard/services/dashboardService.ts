// File: src/features/dashboard/services/dashboardService.ts
/**
 * What it does:
 * Handles all API (network) requests for the dashboard feature.
 *
 * How it works:
 * - Imports the central 'apiClient'.
 * - 'getStats' fetches the main statistics.
 * - 'getRecentActivity' fetches the recent activity feed.
 *
 * How it connects:
 * - 'DashboardPage.tsx' imports 'getStats'.
 * - 'RecentActivity.tsx' imports 'getRecentActivity'.
 */

import apiClient from "../../../lib/apiClient";
import type { DashboardStats, Activity } from "../types/dashboard.types";

export const dashboardService = {
  /**
   * Fetches the main dashboard statistics.
   */
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>("/dashboard/stats");
    return data;
  },

  /**
   * Fetches the 5 most recently updated incidents.
   */
  getRecentActivity: async (): Promise<Activity[]> => {
    const { data } = await apiClient.get<Activity[]>(
      "/incidents/recent-activity"
    );
    return data;
  },
};