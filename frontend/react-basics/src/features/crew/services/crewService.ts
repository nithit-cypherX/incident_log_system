// File: src/features/crew/services/crewService.ts
/**
 * What it does:
 * Handles all API (network) requests for the crew feature.
 *
 * How it works:
 * - Implements the "Service Pattern".
 * - Since no backend is required, this service returns
 * mock data after a short delay to simulate a network request.
 *
 * How it connects:
 * - 'CrewManagementPage.tsx' will import and call
 * 'crewService.getPersonnel' and 'crewService.getEquipment'.
 */

import type {
  PersonnelMember,
  EquipmentItem, 
  EquipmentStatus,
} from "../types/crew.types";

// --- Personnel Mock Data (Unchanged) ---
const MOCK_PERSONNEL_DATA: PersonnelMember[] = [
  {
    id: 1,
    personnel_id: "FC12345",
    name: "Ethan Carter",
    rank_role: "Captain",
    station: "Station 1",
    certifications: "EMT, Firefighter I",
    status: "available",
    contact: "555-123-4567",
  },
  {
    id: 2,
    personnel_id: "FC67890",
    name: "Olivia Bennett",
    rank_role: "Lieutenant",
    station: "Station 2",
    certifications: "Paramedic, Firefighter II",
    status: "on_duty",
    contact: "555-987-6543",
  },
  {
    id: 3,
    personnel_id: "FC11223",
    name: "Noah Thompson",
    rank_role: "Firefighter",
    station: "Station 3",
    certifications: "Firefighter I",
    status: "available",
    contact: "555-111-2222",
  },
  {
    id: 4,
    personnel_id: "FC33445",
    name: "Ava Rodriguez",
    rank_role: "Firefighter",
    station: "Station 1",
    certifications: "EMT, Firefighter I",
    status: "on_leave",
    contact: "555-333-4444",
  },
  {
    id: 5,
    personnel_id: "FC55667",
    name: "Liam Chen",
    rank_role: "Driver",
    station: "Station 2",
    certifications: "Driver Ops, EMT",
    status: "available",
    contact: "555-444-5555",
  },
  {
    id: 6,
    personnel_id: "FC77889",
    name: "Sophia Patel",
    rank_role: "Paramedic",
    station: "Station 3",
    certifications: "Paramedic, Hazmat Ops",
    status: "on_duty",
    contact: "555-666-7777",
  },
];

// 🌟 --- NEW --- 🌟
// Mock data for equipment, based on your SQL snippet.
// I've standardized the statuses to lowercase with underscores
// to match our type conventions (e.g., 'on_duty').
const MOCK_EQUIPMENT_DATA: EquipmentItem[] = [
  {
    id: 1,
    asset_id: "ENG-001",
    type: "Engine",
    status: "in_use",
    last_maintenance_date: "2025-09-12",
  },
  {
    id: 2,
    asset_id: "LAD-002",
    type: "Ladder",
    status: "available",
    last_maintenance_date: "2025-09-10",
  },
  {
    id: 3,
    asset_id: "AMB-003",
    type: "Ambulance",
    status: "available",
    last_maintenance_date: "2025-09-15",
  },
  {
    id: 4,
    asset_id: "TOOL-004",
    type: "Tool",
    status: "maintenance",
    last_maintenance_date: "2025-09-05",
  },
  {
    id: 5,
    asset_id: "ENG-005",
    type: "Engine",
    status: "out_of_service",
    last_maintenance_date: "2025-08-30",
  },
];

export const crewService = {
  /**
   * Fetches the list of all personnel.
   * (Simulated API call)
   */
  getPersonnel: (): Promise<PersonnelMember[]> => {
    console.log("Mock Service: Fetching personnel...");
    // Simulate a network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_PERSONNEL_DATA);
      }, 500); // 0.5 second delay
    });
  },

  /**
   * Fetches the list of all equipment.
   * (Simulated API call)
   */
  getEquipment: (): Promise<EquipmentItem[]> => {
    console.log("Mock Service: Fetching equipment...");
    // Simulate a network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_EQUIPMENT_DATA);
      }, 750); // Slightly different delay
    });
  },

  // In a real app, you would also have:
  // getPersonnelById: (id: string) => Promise<PersonnelMember>
  // createPersonnel: (data: any) => Promise<PersonnelMember>
  // updatePersonnel: (id: string, data: any) => Promise<PersonnelMember>
  // getEquipmentById: (id: string) => Promise<EquipmentItem>
};
