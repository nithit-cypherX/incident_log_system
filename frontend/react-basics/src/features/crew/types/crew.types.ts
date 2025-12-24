// File: src/features/crew/types/crew.types.ts
/**
 * 🌟 --- UPDATED --- 🌟
 * - Made 'password_hash' optional in the Zod schema.
 * - This allows the same schema to be used for both
 * 'create' (where we'll require it) and 'update' (where we'll hide it).
 */

import { z } from "zod";

// --- Personnel Types ---

export type PersonnelStatus = "Active" | "Inactive";

export type PersonnelAvailabilityStatus =
  | "Available"
  | "On_Duty"
  | "Off_Duty"
  | "Assigned_to_Incident";

export type PersonnelMember = {
  id: number;
  full_name: string;
  email: string;
  role: "Firefighter" | "Captain" | "Admin";
  ranks: string | null;
  status: PersonnelStatus;
  availability_status: PersonnelAvailabilityStatus;
};

export const personnelSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["Firefighter", "Captain", "Admin"]),
  ranks: z.string().optional().nullable(),
  status: z.enum(["Active", "Inactive"]),
  availability_status: z.enum([
    "Available",
    "On_Duty",
    "Off_Duty",
    "Assigned_to_Incident",
  ]),
  // 🌟 Made optional. The form logic will handle this.
  password_hash: z.string().optional(),
});

export type PersonnelFormData = z.infer<typeof personnelSchema>;

export type PersonnelSortConfig = {
  key: keyof PersonnelMember;
  direction: "ascending" | "descending";
};

// --- Equipment Types ---

export type EquipmentStatus =
  | "Available"
  | "In_Use"
  | "Maintenance"
  | "Out_of_Service";

export type EquipmentItem = {
  id: number;
  asset_id: string; // e.g., 'ENG-001'
  type: "Engine" | "Ladder" | "Ambulance" | "Specialty_Vehicle" | "Tool";
  status: EquipmentStatus;
  last_maintenance_date: string | null; // Can be null
};

export const equipmentSchema = z.object({
  asset_id: z.string().min(1, "Asset ID is required"),
  type: z.enum([
    "Engine",
    "Ladder",
    "Ambulance",
    "Specialty_Vehicle",
    "Tool",
  ]),
  status: z.enum(["Available", "In_Use", "Maintenance", "Out_of_Service"]),
  // 🌟 Allow null and empty string for the date input
  last_maintenance_date: z.string().optional().nullable(),
});

export type EquipmentFormData = z.infer<typeof equipmentSchema>;

export type EquipmentSortConfig = {
  key: keyof EquipmentItem;
  direction: "ascending" | "descending";
};

// --- Common Types ---
export type CrewPageTab = "personnel" | "equipment";
export type SortDirection = "ascending" | "descending";