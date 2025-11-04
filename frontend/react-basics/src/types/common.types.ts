// File: src/types/common.types.ts
/**
 * What it does:
 * Defines common TypeScript types that are shared across
 * multiple features (like 'Incident', 'Personnel', 'Attachment').
 *
 * How it works:
 * We export interfaces and types for our core data.
 *
 * How it connects:
 * - 'features/incident' will import these types.
 * - 'features/dashboard' might import these types.
 * - This prevents duplicating type definitions.
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
  // You can add lat/lon here if you fetch them
  // latitude?: number;
  // longitude?: number;
};

/**
 * Represents a user in the system (for crew selection).
 * (From 'NewIncidentPage.tsx')
 */
export type AvailableCrew = {
  id: number;
  full_name: string;
};