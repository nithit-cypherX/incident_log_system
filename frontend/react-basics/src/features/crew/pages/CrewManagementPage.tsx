// File: src/features/crew/pages/CrewManagementPage.tsx
/**
 * What it does:
 * The "smart" page component for "Crew & Equipment Management".
 *
 * How it works:
 * - Manages all state for this feature.
 * - 'activeTab': Tracks whether 'personnel' or 'equipment' is selected.
 * - 'personnel' & 'equipment' states start as empty arrays.
 * - 🌟 'useEffect' now fetches data and *directly* sets the state
 * without managing 'loading' or 'error' states. The tables
 * will be empty until the data arrives.
 * - 'handleSort' and 'handleEquipmentSort' update sort states.
 * - 'useMemo' is used to create 'sortedPersonnel' AND 'sortedEquipment'.
 * - The render function is dynamic and passes the lists (which
 * are initially empty) to the dumb tables.
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
  EquipmentItem,
  EquipmentSortConfig,
  EquipmentStatus,
} from "../types/crew.types";
import { crewService } from "../services/crewService";
import PersonnelTable from "../components/PersonnelTable";
import EquipmentTable from "../components/EquipmentTable";

const CrewManagementPage = () => {
  // 1. --- State Management ---
  const [activeTab, setActiveTab] = useState<CrewPageTab>("personnel");

  // State for Personnel
  const [personnel, setPersonnel] = useState<PersonnelMember[]>([]);
  // 🌟 REMOVED: isLoading and error states
  const [sortConfig, setSortConfig] = useState<PersonnelSortConfig>({
    key: "name",
    direction: "ascending",
  });

  // State for Equipment
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [equipmentSortConfig, setEquipmentSortConfig] =
    useState<EquipmentSortConfig>({
      key: "asset_id",
      direction: "ascending",
    });

  // 2. --- Data Fetching ---
  // 🌟 This effect now directly fetches and sets data.
  useEffect(() => {
    if (activeTab === "personnel") {
      // No loading state set.
      crewService.getPersonnel().then((data) => {
        setPersonnel(data);
      });
      // We don't catch errors, as we aren't displaying them.
      // In a real app, you'd still want to log them.
    } else if (activeTab === "equipment") {
      // No loading state set.
      crewService.getEquipment().then((data) => {
        setEquipment(data);
      });
    }
  }, [activeTab]);

  // 3. --- Helper Functions --- (Unchanged)

  const getTabClass = (tabName: CrewPageTab): string => {
    const baseClass = "pb-2 px-1 font-medium transition-colors";
    if (activeTab === tabName) {
      return `${baseClass} text-primary-color border-b-2 border-[#0D6EFD]`;
    }
    return `${baseClass} text-secondary-color hover:text-primary-color`;
  };

  const handleSort = (key: keyof PersonnelMember) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const handleEquipmentSort = (key: keyof EquipmentItem) => {
    setEquipmentSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const getPersonnelStatusOrder = (status: PersonnelStatus) =>
    ({ available: 1, on_duty: 2, on_leave: 3 }[status] || 99);

  const getEquipmentStatusOrder = (status: EquipmentStatus) =>
    ({
      available: 1,
      in_use: 2,
      maintenance: 3,
      out_of_service: 4,
    }[status] || 99);

  // 4. --- Memoized Sorting --- (Unchanged)

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
      if (aValue < bValue)
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue)
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sortablePersonnel;
  }, [personnel, sortConfig]);

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

      {/* 5c. Dynamic Controls Bar (Search, Add New) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-secondary-color" />
          </div>
          <input
            type="text"
            placeholder={
              activeTab === "personnel"
                ? "Search personnel (name, ID, role...)"
                : "Search equipment (type, ID, station...)"
            }
            className="w-full p-3 h-12 pl-10 form-input rounded-md placeholder-[#ADB5BD]"
          />
        </div>
        <div className="flex gap-3">
          <button
            className={
              activeTab === "personnel"
                ? "btn-main-red py-2 px-4 rounded-md h-12 justify-center"
                : "btn-main-red py-2 px-4 rounded-md h-12 justify-center"
            }
          >
            <FaPlus className="mr-2" />
            {activeTab === "personnel"
              ? "Add New Firefighter"
              : "Add New Equipment"}
          </button>
        </div>
      </div>

      {/* 5d. 🌟 Dynamic Content (Now passes no loading/error props) */}
      {activeTab === "personnel" ? (
        <PersonnelTable
          personnel={sortedPersonnel}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      ) : (
        <EquipmentTable
          equipment={sortedEquipment}
          sortConfig={equipmentSortConfig}
          onSort={handleEquipmentSort}
        />
      )}

      {/* 5e. Dynamic Pagination */}
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