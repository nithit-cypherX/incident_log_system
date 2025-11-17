// File: src/features/crew/types/crew.types.ts
/**
 * What it does:
 * Defines the TypeScript types for the data used in the
 * Crew & Equipment Management feature.
 *
 * How it connects:
 * - 'crewService.ts' will use these types for its mock data response.
 * - 'CrewManagementPage.tsx' and 'PersonnelTable.tsx' will use
 * these types for their props and state.
 */

/**
 * Represents the status of a personnel member.
 * This matches the new types added to StatusBadge.tsx.
 */
export type PersonnelStatus = "available" | "on_duty" | "on_leave";

/**
 * Represents a single personnel member in the list.
 * The fields are based on the 'Detail.pdf' [cite: 50-56] and the mockup image.
 */
export type PersonnelMember = {
  id: number; // The database ID (e.g., 1, 2, 3)
  personnel_id: string; // The display ID (e.g., "FC12345")
  name: string;
  rank_role: string;
  station: string;
  certifications: string;
  status: PersonnelStatus;
  contact: string;
};

/**
 * Defines the available tabs on the page.
 */
export type CrewPageTab = "personnel" | "equipment";

/**
 * Defines the sort direction.
 */
export type SortDirection = "ascending" | "descending";

/**
 * Defines the state for sorting the personnel table.
 * 'key' must be one of the properties of 'PersonnelMember'.
 */
export type PersonnelSortConfig = {
  key: keyof PersonnelMember;
  direction: SortDirection;
};

/**
 * Represents the status of an equipment item.
 * Based on the sample SQL data.
 */
export type EquipmentStatus =
  | "available"
  | "in_use"
  | "maintenance"
  | "out_of_service";

/**
 * Represents a single equipment item in the list.
 * Based on the sample SQL data and user request.
 */
export type EquipmentItem = {
  id: number; // For React key
  asset_id: string; // e.g., 'ENG-001'
  type: "Engine" | "Ladder" | "Ambulance" | "Tool" | "Specialty";
  status: EquipmentStatus;
  last_maintenance_date: string; // ISO date string
};

/**
 * Defines the state for sorting the equipment table.
 */
export type EquipmentSortConfig = {
  key: keyof EquipmentItem;
  direction: SortDirection;
};
