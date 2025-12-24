// File: src/features/crew/services/crewService.ts
/**
 * What it does:
 * Handles all API (network) requests for the crew feature.
 *
 * 🌟 --- UPDATED --- 🌟
 * This service is now connected to the REAL backend API.
 * All mock data has been removed.
 *
 * How it works:
 * - Implements the "Service Pattern" (Guide Part 3).
 * - Imports 'apiClient' to make real network requests.
 * - Provides full CRUD (Create, Read, Update, Delete) functions.
 *
 * How it connects:
 * - 'CrewManagementPage.tsx' will import and call these functions.
 */

import apiClient from "../../../lib/apiClient";
import type {
  PersonnelMember,
  PersonnelFormData,
  EquipmentItem,
  EquipmentFormData,
} from "../types/crew.types";

export const crewService = {
  // --- Personnel CRUD ---

  /**
   * [READ] Fetches the list of all personnel.
   */
  getPersonnel: async (): Promise<PersonnelMember[]> => {
    const { data } = await apiClient.get<PersonnelMember[]>("/personnel");
    return data;
  },

  /**
   * [CREATE] Creates a new personnel member.
   */
  createPersonnel: async (
    personnelData: PersonnelFormData
  ): Promise<PersonnelMember> => {
    const { data } = await apiClient.post<PersonnelMember>(
      "/personnel",
      personnelData
    );
    return data;
  },

  /**
   * [UPDATE] Updates an existing personnel member.
   */
  updatePersonnel: async (
    id: number,
    personnelData: PersonnelFormData
  ): Promise<PersonnelMember> => {
    const { data } = await apiClient.put<PersonnelMember>(
      `/personnel/${id}`,
      personnelData
    );
    return data;
  },

  /**
   * [DELETE] Deletes a personnel member.
   */
  deletePersonnel: async (id: number): Promise<void> => {
    await apiClient.delete(`/personnel/${id}`);
  },

  // --- Equipment CRUD ---

  /**
   * [READ] Fetches the list of all equipment.
   */
  getEquipment: async (): Promise<EquipmentItem[]> => {
    const { data } = await apiClient.get<EquipmentItem[]>("/equipment");
    return data;
  },

  /**
   * [CREATE] Creates a new equipment item.
   */
  createEquipment: async (
    equipmentData: EquipmentFormData
  ): Promise<EquipmentItem> => {
    const { data } = await apiClient.post<EquipmentItem>(
      "/equipment",
      equipmentData
    );
    return data;
  },

  /**
   * [UPDATE] Updates an existing equipment item.
   */
  updateEquipment: async (
    id: number,
    equipmentData: EquipmentFormData
  ): Promise<EquipmentItem> => {
    const { data } = await apiClient.put<EquipmentItem>(
      `/equipment/${id}`,
      equipmentData
    );
    return data;
  },

  /**
   * [DELETE] Deletes an equipment item.
   */
  deleteEquipment: async (id: number): Promise<void> => {
    await apiClient.delete(`/equipment/${id}`);
  },
};