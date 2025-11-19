// File: src/features/incident/services/incidentService.ts
/**
 * What it does:
 * Handles ALL API requests for the 'incident' feature.
 *
 * 🌟 --- UPDATED --- 🌟
 * - Imported the new 'AvailableEquipment' type.
 * - Added a new function 'getAvailableEquipment' to fetch
 * all equipment for the form dropdown.
 *
 * How it connects:
 * - 'IncidentFormPage' will now call 'getAvailableEquipment'.
 */

import apiClient from "../../../lib/apiClient";
import type {
  Incident,
  AvailableCrew,
  AvailableEquipment, // 🌟 Added
} from "../../../types/common.types";
import type { IncidentFormData } from "../types/incident.types";
import type { Attachment } from "../../../types/common.types";

// This is the shape of the data from the 'incident list' endpoint
type IncidentListItem = {
  id: number;
  incident_code: string;
  incident_type: string;
  reported_at: string;
  address: string;
  status: "active" | "closed" | "pending";
  priority: "high" | "medium" | "low";
};

export const incidentService = {
  // --- Incident ---

  getAllIncidents: async (): Promise<IncidentListItem[]> => {
    const { data } = await apiClient.get<IncidentListItem[]>("/incidents");
    return data;
  },

  searchIncidents: async (query: string): Promise<IncidentListItem[]> => {
    const { data } = await apiClient.get<IncidentListItem[]>(
      `/incidents/search?q=${encodeURIComponent(query)}`
    );
    return data;
  },

  getIncidentById: async (id: string): Promise<Incident> => {
    const { data } = await apiClient.get<Incident>(`/incidents/${id}`);
    return data;
  },

  createIncident: async (
    incidentData: IncidentFormData
  ): Promise<{ incident_id: number }> => {
    const { data } = await apiClient.post<{ incident_id: number }>(
      "/incidents/create",
      incidentData
    );
    return data;
  },

  updateIncident: async (
    id: string,
    incidentData: IncidentFormData
  ): Promise<Incident> => {
    const { data } = await apiClient.put<Incident>(
      `/incidents/${id}`,
      incidentData
    );
    return data;
  },

  deleteIncident: async (id: string): Promise<void> => {
    await apiClient.delete(`/incidents/${id}`);
  },

  // --- Crew & Equipment ---

  getAvailableCrew: async (): Promise<AvailableCrew[]> => {
    const { data } = await apiClient.get<AvailableCrew[]>("/personnel");
    return data;
  },

  // 🌟 --- NEW FUNCTION --- 🌟
  /**
   * Fetches all available equipment for the form dropdown.
   */
  getAvailableEquipment: async (): Promise<AvailableEquipment[]> => {
    // This reuses the endpoint we already built for the Crew page!
    const { data } = await apiClient.get<AvailableEquipment[]>("/equipment");
    return data;
  },
  // 🌟 --- END NEW --- 🌟

  // --- Attachments ---

  uploadAttachment: async (
    incidentId: string,
    file: File): Promise<Attachment> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<Attachment>(
      `/incidents/${incidentId}/attachments`,
      formData,
      {
        // Must override header for file uploads
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  deleteAttachment: async (attachmentId: number): Promise<void> => {
    await apiClient.delete(`/attachments/${attachmentId}`);
  },
};