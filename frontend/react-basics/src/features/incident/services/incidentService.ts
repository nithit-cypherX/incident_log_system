// File: src/features/incident/services/incidentService.ts
/**
 * What it does:
 * Handles ALL API requests for the 'incident' feature.
 *
 * How it works:
 * - Implements the "Service Pattern" (Guide Part 3).
 * - 'getAllIncidents', 'searchIncidents', 'getIncidentById', etc.
 * - It also includes file upload and crew-related fetches.
 * - Uses 'apiClient' for all requests.
 *
 * How it connects:
 * - 'IncidentDashboardPage' uses 'getAllIncidents' and 'searchIncidents'.
 * - 'IncidentDetailsPage' uses 'getIncidentById' and 'deleteIncident'.
 * - 'IncidentFormPage' uses 'getIncidentById', 'createIncident',
 * 'updateIncident', 'getAvailableCrew', and 'uploadAttachment'.
 * - 'IncidentAttachments.tsx' uses 'deleteAttachment'.
 */

import apiClient from "../../../lib/apiClient";
import type { Incident, AvailableCrew } from "../../../types/common.types";
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

  // --- Crew ---

  getAvailableCrew: async (): Promise<AvailableCrew[]> => {
    const { data } = await apiClient.get<AvailableCrew[]>("/personnel");
    return data;
  },

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