// File: src/features/incident/types/incident.types.ts
/**
 * What it does:
 * Infers TypeScript types from our Zod schemas (Guide Part 4)
 * and defines shared types for the incident feature.
 *
 * How it connects:
 * - 'IncidentFormPage.tsx' and 'IncidentForm.tsx'
 * import these types to use with React Hook Form.
 * - 'IncidentDashboardPage.tsx' and 'IncidentListTable.tsx'
 * import these types for the incident list.
 */

import { z } from "zod";
import { incidentSchema, selectedCrewSchema } from "../validators/incidentSchema";

// The main form data type
export type IncidentFormData = z.infer<typeof incidentSchema>;

// The type for a single crew member in the form's list
export type SelectedCrewMember = z.infer<typeof selectedCrewSchema>;

// 🌟 --- ADDED TYPES --- 🌟
// These types were moved from IncidentDashboardPage.tsx

/**
 * Represents a single item in the incident list.
 */
export type IncidentListItem = {
  db_id: number;
  id: string; // incident_code
  type: string; // incident_type
  date: string; // formatted reported_at
  address: string;
  status: "active" | "closed" | "pending";
  priority: "high" | "medium" | "low";
};

/**
 * Defines the sort direction.
 */
export type SortDirection = "ascending" | "descending";

/**
 * Defines the state for sorting.
 */
export type SortConfig = {
  key: keyof IncidentListItem;
  direction: SortDirection;
};

/**
 * Defines the state for filtering.
 */
export type FilterState = {
  status: string;
  incidentType: string;
  priority: string;
};
// 🌟 --- END OF ADDED TYPES --- 🌟