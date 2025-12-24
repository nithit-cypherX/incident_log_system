// File: src/features/dashboard/types/dashboard.types.ts
/**
 * What it does:
 * Defines the TypeScript types for the data used in the dashboard.
 *
 * How it connects:
 * - 'dashboardService.ts' uses these types for its API response.
 * - 'DashboardPage.tsx' and its child components use
 * these types for their props.
 */

export type IncidentTypeData = {
  incident_type: string;
  count: number;
};

export type DashboardStats = {
  activeIncidents: number;
  pendingIncidents: number;
  incidentsToday: number;
  crewsAvailable: number;
  equipmentInUse: number;
  totalIncidents: number;
  incidentTypeBreakdown: IncidentTypeData[];
};

export type Activity = {
  id: number;
  incident_code: string;
  title: string;
  status: "active" | "pending" | "closed";
  updated_at: string;
};