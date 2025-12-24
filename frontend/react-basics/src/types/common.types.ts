// File: src/types/common.types.ts
/**
 * What it does:
 * Defines common TypeScript types that are shared across
 * multiple features (like 'Incident', 'Personnel', 'Attachment').
 *
 * 🌟 --- UPDATED --- 🌟
 * - Added 'AvailableEquipment' type for the form.
 * - Added 'AssignedEquipment' type for the details page.
 * - Added 'assigned_equipment' array to the 'Incident' type.
 */

/**
 * Represents a user assigned to an incident.
 * (From 'CurrentCrew.tsx' and 'IncidentDetailsPage.tsx')
 */
export type Personnel = {
  user_id: number;
  user_name: string;
  role_on_incident: string;
};

/**
 * Represents a file attachment.
 * (From 'IncidentDetailsPage.tsx' and 'IncidentAttachments.tsx')
 */
export type Attachment = {
  id: number;
  incident_id: number;
  user_id: number;
  original_file_name: string;
  file_name_on_disk: string;
  file_path_relative: string;
  mime_type: string;
  file_size_bytes: number;
  uploaded_at: string;
};

/**
 * Defines the possible states for an incident.
 */
export type IncidentStatus = "active" | "pending" | "closed";

/**
 * Defines the possible priorities for an incident.
 */
export type IncidentPriority = "high" | "medium" | "low";

/**
 * Defines the possible types for an incident.
 */
export type IncidentType =
  | "fire"
  | "ems"
  | "rescue"
  | "hazmat"
  | "public_assist"
  | "other";

// 🌟 --- NEW: EQUIPMENT TYPES --- 🌟

/**
 * Represents equipment in the selection dropdown.
 */
export type AvailableEquipment = {
  id: number;
  asset_id: string; // e.g., "ENG-001"
  type: string;
  status: string;
};

/**
 * Represents equipment that is assigned to an incident.
 * (This matches the new API response from server.js)
 */
export type AssignedEquipment = {
  id: number; // This is the 'incident_equipment' table ID
  equipment_id: number; // This is the 'equipment' table ID
  asset_id: string;
  type: string;
  status: string;
};
// 🌟 --- END NEW --- 🌟

/**
 * Represents the full Incident data object from the API.
 * (From 'IncidentDetailsPage.tsx')
 */
export type Incident = {
  id: number; // This is the database ID (e.g., 1, 2, 3)
  incident_code: string; // This is the string ID (e.g., "INC-001")
  title: string;
  incident_type: IncidentType;
  status: IncidentStatus;
  priority: IncidentPriority;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  description: string;
  reported_at: string; // ISO string
  created_by_user_id: number;
  assigned_personnel: Personnel[];
  assigned_attachments: Attachment[];
  
  // 🌟 --- NEW --- 🌟
  // These fields are now read from the database
  latitude: number | null;
  longitude: number | null;
  assigned_equipment: AssignedEquipment[]; // 🌟 Added this line
  // 🌟 --- END NEW --- 🌟
};

/**
 * Represents a user in the system (for crew selection).
 * (From 'NewIncidentPage.tsx')
 */
export type AvailableCrew = {
  id: number;
  full_name: string;
};