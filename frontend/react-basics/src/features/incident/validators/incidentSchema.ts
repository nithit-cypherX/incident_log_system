// File: src/features/incident/validators/incidentSchema.ts
/**
 * What it does:
 * Defines the validation rules for the main incident form (Guide Part 4).
 *
 * How it works:
 * - Creates a 'zod' schema for all form fields.
 * - 'z.object' defines the shape.
 * - '.min(1)' means 'required'.
 * - We create a 'SelectedCrewMember' schema to validate the array.
 *
 * How it connects:
 * - 'IncidentFormPage.tsx' uses this to power React Hook Form.
 * - 'incident.types.ts' infers its 'IncidentFormData' from this.
 */

import { z } from "zod";

// Schema for a single assigned crew member
export const selectedCrewSchema = z.object({
  userId: z.number().min(1, "User ID is required"),
  userName: z.string(), // Not validated, just part of the object
  role: z.string().min(1, "Role is required"),
});

// Main schema for the incident form
export const incidentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title is too long"),
  incident_type: z.string().min(1, "Incident type is required"),
  priority: z.string().min(1, "Priority is required"),
  status: z.string().min(1, "Status is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(255, "Address is too long"),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zip_code: z.string().max(20).optional(),
  description: z.string().optional(),

  // This is the array of assigned crew members
  selectedCrew: z.array(selectedCrewSchema),
  
  // These are for the API payload, not direct form fields,
  // but we can put them in the RHF data object.
  reported_at: z.string().optional(),
  initial_crew: z
    .array(
      z.object({
        user_id: z.number(),
        role_on_incident: z.string(),
      })
    )
    .optional(),
});