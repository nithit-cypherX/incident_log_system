// File: src/features/crew/pages/CrewManagementPage.tsx
/**
 * What it does:
 * The "smart" page component for "Crew & Equipment Management".
 *
 * How it works:
 * - Manages all state for this feature, now for BOTH tabs.
 * - 'activeTab': Tracks whether 'personnel' or 'equipment' is selected.
 * - 'personnel', 'isLoading', 'error', 'sortConfig': State for the Personnel tab.
 * - 🌟 'equipment', 'isEquipmentLoading', 'equipmentError', 'equipmentSortConfig':
 * New state for the Equipment tab.
 * - 'useEffect' now fetches data based on the 'activeTab'.
 * - 🌟 'handleSort' (for personnel) and 'handleEquipmentSort' (for equipment)
 * update their respective sort states.
 * - 🌟 'useMemo' is used to create 'sortedPersonnel' AND 'sortedEquipment'.
 * - 🌟 The render function is now dynamic:
 * - The Search Bar placeholder changes.
 * - The "Add New" button text changes.
 * - It renders <PersonnelTable> or <EquipmentTable> based on 'activeTab'.
 * - The pagination text updates based on the active list.
 *
 * How it connects:
 * - 'App.tsx' routes '/crew-management' to this page.
 * - It imports and renders 'PersonnelTable' AND 'EquipmentTable'.
 * - It imports and uses 'crewService' to get data for both.
 */

import { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import type {
  PersonnelMember,
  CrewPageTab,
  PersonnelSortConfig,
  PersonnelStatus,
  // 🌟 Import new equipment types
  EquipmentItem,
  EquipmentSortConfig,
  EquipmentStatus,
} from "../types/crew.types";
import { crewService } from "../services/crewService";
import PersonnelTable from "../components/PersonnelTable";
// 🌟 Import the new EquipmentTable component
import EquipmentTable from "../components/EquipmentTable";
// 🌟 We no longer need the placeholder
// import EquipmentPlaceholder from "../components/EquipmentPlaceholder";

const CrewManagementPage = () => {
  // 1. --- State Management ---
  const [activeTab, setActiveTab] = useState<CrewPageTab>("personnel");

  // State for Personnel
  const [personnel, setPersonnel] = useState<PersonnelMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<PersonnelSortConfig>({
    key: "name",
    direction: "ascending",
  });

  // 🌟 State for Equipment
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [isEquipmentLoading, setIsEquipmentLoading] = useState(true);
  const [equipmentError, setEquipmentError] = useState<string | null>(null);
  const [equipmentSortConfig, setEquipmentSortConfig] =
    useState<EquipmentSortConfig>({
      key: "asset_id",
      direction: "ascending",
    });

  // 2. --- Data Fetching ---
  // 🌟 This effect now fetches data based on the active tab
  useEffect(() => {
    if (activeTab === "personnel") {
      const fetchPersonnel = async () => {
        try {
          setIsLoading(true); // Use the personnel loading state
          const data = await crewService.getPersonnel();
          setPersonnel(data);
        } catch (err: any) {
          setError(err.message); // Use the personnel error state
        } finally {
          setIsLoading(false);
        }
      };
      fetchPersonnel();
    } else if (activeTab === "equipment") {
      const fetchEquipment = async () => {
        try {
          setIsEquipmentLoading(true); // Use the equipment loading state
          const data = await crewService.getEquipment();
          setEquipment(data);
        } catch (err: any) {
          setEquipmentError(err.message); // Use the equipment error state
        } finally {
          setIsEquipmentLoading(false);
        }
      };
      fetchEquipment();
    }
  }, [activeTab]); // Re-run whenever the tab changes

  // 3. --- Helper Functions ---

  const getTabClass = (tabName: CrewPageTab): string => {
    const baseClass = "pb-2 px-1 font-medium transition-colors";
    if (activeTab === tabName) {
      return `${baseClass} text-primary-color border-b-2 border-[#0D6EFD]`;
    }
    return `${baseClass} text-secondary-color hover:text-primary-color`;
  };

  // Sort handler for Personnel
  const handleSort = (key: keyof PersonnelMember) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // 🌟 New sort handler for Equipment
  const handleEquipmentSort = (key: keyof EquipmentItem) => {
    setEquipmentSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // Helper for sorting personnel by status
  const getPersonnelStatusOrder = (status: PersonnelStatus) =>
    ({ available: 1, on_duty: 2, on_leave: 3 }[status] || 99);

  // 🌟 New helper for sorting equipment by status
  const getEquipmentStatusOrder = (status: EquipmentStatus) =>
    ({
      available: 1,
      in_use: 2,
      maintenance: 3,
      out_of_service: 4,
    }[status] || 99);

  // 4. --- Memoized Sorting ---

  // Memoized sorted list for Personnel
  const sortedPersonnel = useMemo(() => {
    let sortablePersonnel = [...personnel];
    sortablePersonnel.sort((a, b) => {
      const key = sortConfig.key;
      let aValue: string | number = a[key];
      let bValue: string | number = b[key];
      if (key === "status") {
        aValue = getPersonnelStatusOrder(a.status);
        bValue = getPersonnelStatusOrder(b.status);
      }
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sortablePersonnel;
  }, [personnel, sortConfig]);

  // 🌟 New memoized sorted list for Equipment
  const sortedEquipment = useMemo(() => {
    let sortableEquipment = [...equipment];
    sortableEquipment.sort((a, b) => {
      const key = equipmentSortConfig.key;
      let aValue: string | number = a[key];
      let bValue: string | number = b[key];

      if (key === "status") {
        aValue = getEquipmentStatusOrder(a.status);
        bValue = getEquipmentStatusOrder(b.status);
      } else if (key === "last_maintenance_date") {
        // Handle date sorting
        aValue = new Date(a.last_maintenance_date).getTime();
        bValue = new Date(b.last_maintenance_date).getTime();
      }

      if (aValue < bValue)
        return equipmentSortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue)
        return equipmentSortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sortableEquipment;
  }, [equipment, equipmentSortConfig]);

  // 5. --- Render ---

  // 🌟 Determine current list and count for pagination
  const currentItems =
    activeTab === "personnel" ? sortedPersonnel : sortedEquipment;
  const currentItemCount = currentItems.length;

  return (
    <div className="space-y-6">
      {/* 5a. Page Title */}
      <h2 className="text-3xl font-bold text-primary-color">
        Crew & Equipment Management
      </h2>

      {/* 5b. Tabs (Personnel & Equipment) */}
      <div className="border-b border-[#495057]">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("personnel")}
            className={getTabClass("personnel")}
          >
            Personnel
          </button>
          <button
            onClick={() => setActiveTab("equipment")}
            className={getTabClass("equipment")}
          >
            Equipment
          </button>
        </nav>
      </div>

      {/* 5c. 🌟 Dynamic Controls Bar (Search, Add New) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        {/* Dynamic Search Bar */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-secondary-color" />
          </div>
          <input
            type="text"
            placeholder={
              activeTab === "personnel"
                ? "Search personnel (name, ID, role...)" // [cite: 38]
                : "Search equipment (type, ID, status...)" // [cite: 66]
            }
            className="w-full p-3 h-12 pl-10 form-input rounded-md placeholder-[#ADB5BD]"
          />
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* 🌟 Dynamic "Add New" Button */}
          <button
            className={
              activeTab === "personnel"
                ? "btn-main-red py-2 px-4 rounded-md h-12 justify-center" // Use blue for personnel
                : "btn-main-red py-2 px-4 rounded-md h-12 justify-center" // Use red for equipment [cite: 4, 72]
            }
          >
            <FaPlus className="mr-2" />
            {
              activeTab === "personnel"
                ? "Add New Firefighter"
                : "Add New Equipment" // [cite: 73]
            }
          </button>
        </div>
      </div>

      {/* 5d. 🌟 Dynamic Content (The Table or Placeholder) */}
      {activeTab === "personnel" ? (
        <PersonnelTable
          personnel={sortedPersonnel}
          isLoading={isLoading}
          error={error}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ) : (
        <EquipmentTable
          equipment={sortedEquipment}
          isLoading={isEquipmentLoading}
          error={equipmentError}
          sortConfig={equipmentSortConfig}
          onSort={handleEquipmentSort}
        />
      )}

      {/* 5e. 🌟 Dynamic Pagination */}
      <div className="flex items-center justify-between mt-6 text-sm">
        <span className="text-secondary-color">
          Showing 1 to {Math.min(currentItemCount, 10)} of {currentItemCount}{" "}
          results
        </span>
        <div className="flex gap-1">
          <button
            className="py-2 px-3 btn-main-gray rounded-md disabled:opacity-40"
            disabled
          >
            <FaChevronLeft />
          </button>
          <button className="py-2 px-4 bg-[#0D6EFD] text-white font-bold rounded-md">
            1
          </button>
          <button className="py-2 px-4 btn-main-gray rounded-md">2</button>
          <button className="py-2 px-4 btn-main-gray rounded-md">3</button>
          <button className="py-2 px-4 btn-main-gray rounded-md">...</button>
          <button
            className="py-2 px-4 btn-main-gray rounded-md"
            disabled={currentItemCount <= 10}
          >
            10
          </button>
          <button
            className="py-2 px-3 btn-main-gray rounded-md"
            disabled={currentItemCount <= 10}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrewManagementPage;
