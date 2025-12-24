// File: src/features/crew/pages/CrewManagementPage.tsx
/**
 * 🌟 --- FULLY UPDATED --- 🌟
 * - Manages modal state ('modalOpen', 'modalMode', 'editingItem').
 * - Handles all CRUD logic (Create, Read, Update, Delete).
 * - Connects 'Add New', 'Edit', and 'Delete' buttons to functions.
 * - Renders the new Modal and Form components.
 * - 🌟 ADDED 'pageError' state for delete actions.
 * - 🌟 UPDATED 'handleDelete' functions to use try...catch and set 'pageError'.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  FaSearch,
  FaPlus,
  FaRedo,
  FaExclamationTriangle,
} from "react-icons/fa";
import type {
  PersonnelMember,
  CrewPageTab,
  PersonnelSortConfig,
  EquipmentItem,
  EquipmentSortConfig,
  PersonnelAvailabilityStatus,
  EquipmentStatus,
  PersonnelFormData, // 🌟 Added
  EquipmentFormData, // 🌟 Added
} from "../types/crew.types";
import { crewService } from "../services/crewService";
import PersonnelTable from "../components/PersonnelTable";
import EquipmentTable from "../components/EquipmentTable";
import Modal from "../../../components/ui/Modal"; // 🌟 Added
import PersonnelForm from "../components/PersonnelForm"; // 🌟 Added
import EquipmentForm from "../components/EquipmentForm"; // 🌟 Added
import { AxiosError } from "axios"; // 🌟 Added

// 🌟 --- Default "empty" states for our forms --- 🌟
const defaultPersonnelForm: PersonnelFormData = {
  full_name: "",
  email: "",
  role: "Firefighter",
  ranks: "",
  status: "Active",
  availability_status: "Available",
  password_hash: "",
};

const defaultEquipmentForm: EquipmentFormData = {
  asset_id: "",
  type: "Engine",
  status: "Available",
  last_maintenance_date: "",
};
// ----------------------------------------------------

const CrewManagementPage = () => {
  // 1. --- State Management ---
  const [activeTab, setActiveTab] = useState<CrewPageTab>("personnel");

  // Data State
  const [personnel, setPersonnel] = useState<PersonnelMember[]>([]);
  const [personnelLoading, setPersonnelLoading] = useState(true);
  const [personnelError, setPersonnelError] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [equipmentLoading, setEquipmentLoading] = useState(true);
  const [equipmentError, setEquipmentError] = useState<string | null>(null);

  // Sort State
  const [sortConfig, setSortConfig] = useState<PersonnelSortConfig>({
    key: "full_name",
    direction: "ascending",
  });
  const [equipmentSortConfig, setEquipmentSortConfig] =
    useState<EquipmentSortConfig>({
      key: "asset_id",
      direction: "ascending",
    });

  // 🌟 --- Modal & Form State --- 🌟
  const [modalMode, setModalMode] = useState<
    | "create-personnel"
    | "edit-personnel"
    | "create-equipment"
    | "edit-equipment"
    | null
  >(null);
  const [editingItem, setEditingItem] = useState<
    PersonnelMember | EquipmentItem | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crudError, setCrudError] = useState<string | null>(null); // For modal
  const [pageError, setPageError] = useState<string | null>(null); // 🌟 For delete
  // ------------------------------

  // 2. --- Data Fetching ---
  const fetchPersonnel = useCallback(async () => {
    setPersonnelLoading(true);
    setPersonnelError(null); // 🌟 Clear page error on refresh
    setPageError(null);
    try {
      const data = await crewService.getPersonnel();
      setPersonnel(data);
    } catch (err: any) {
      setPersonnelError(err.message || "Failed to fetch personnel");
    } finally {
      setPersonnelLoading(false);
    }
  }, []);

  const fetchEquipment = useCallback(async () => {
    setEquipmentLoading(true);
    setEquipmentError(null); // 🌟 Clear page error on refresh
    setPageError(null);
    try {
      const data = await crewService.getEquipment();
      setEquipment(data);
    } catch (err: any) {
      setEquipmentError(err.message || "Failed to fetch equipment");
    } finally {
      setEquipmentLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "personnel") {
      fetchPersonnel();
    } else if (activeTab === "equipment") {
      fetchEquipment();
    }
  }, [activeTab, fetchPersonnel, fetchEquipment]);

  // 3. --- 🌟 Modal & CRUD Handlers --- 🌟
  const handleCloseModal = () => {
    setModalMode(null);
    setEditingItem(null);
    setCrudError(null);
    setIsSubmitting(false);
  };

  // --- Personnel Handlers ---
  const handleOpenCreatePersonnel = () => {
    setModalMode("create-personnel");
    setEditingItem(null); // Not editing
  };

  const handleEditPersonnel = (member: PersonnelMember) => {
    setModalMode("edit-personnel");
    setEditingItem(member);
  };

  const onPersonnelSubmit = async (data: PersonnelFormData) => {
    setIsSubmitting(true);
    setCrudError(null);
    setPageError(null); // 🌟 Clear page error
    try {
      if (modalMode === "edit-personnel" && editingItem) {
        // UPDATE
        await crewService.updatePersonnel(editingItem.id, data);
      } else {
        // CREATE
        await crewService.createPersonnel(data);
      }
      handleCloseModal();
      fetchPersonnel(); // Re-fetch data
    } catch (err: any) {
      // 🌟 Handle server validation errors
      if (err instanceof AxiosError && err.response?.data?.error) {
        setCrudError(err.response.data.error);
      } else {
        setCrudError(err.message || "Failed to save personnel.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePersonnel = async (member: PersonnelMember) => {
    if (
      !window.confirm(`Are you sure you want to delete ${member.full_name}?`)
    ) {
      return;
    }
    setPageError(null); // 🌟 Clear old errors
    try {
      await crewService.deletePersonnel(member.id);
      fetchPersonnel(); // Re-fetch data
    } catch (err: any) {
      // 🌟 Show the error from the server!
      if (err instanceof AxiosError && err.response?.data?.error) {
        setPageError(err.response.data.error);
      } else {
        setPageError(err.message);
      }
    }
  };

  // --- Equipment Handlers ---
  const handleOpenCreateEquipment = () => {
    setModalMode("create-equipment");
    setEditingItem(null);
  };

  const handleEditEquipment = (item: EquipmentItem) => {
    setModalMode("edit-equipment");
    setEditingItem(item);
  };

  const onEquipmentSubmit = async (data: EquipmentFormData) => {
    setIsSubmitting(true);
    setCrudError(null);
    setPageError(null); // 🌟 Clear page error
    try {
      if (modalMode === "edit-equipment" && editingItem) {
        // UPDATE
        await crewService.updateEquipment(editingItem.id, data);
      } else {
        // CREATE
        await crewService.createEquipment(data);
      }
      handleCloseModal();
      fetchEquipment(); // Re-fetch data
    } catch (err: any) {
      // 🌟 Handle server validation errors
      if (err instanceof AxiosError && err.response?.data?.error) {
        setCrudError(err.response.data.error);
      } else {
        setCrudError(err.message || "Failed to save equipment.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEquipment = async (item: EquipmentItem) => {
    if (
      !window.confirm(`Are you sure you want to delete ${item.asset_id}?`)
    ) {
      return;
    }
    setPageError(null); // 🌟 Clear old errors
    try {
      await crewService.deleteEquipment(item.id);
      fetchEquipment(); // Re-fetch
    } catch (err: any) {
      // 🌟 Show the error from the server!
      if (err instanceof AxiosError && err.response?.data?.error) {
        setPageError(err.response.data.error);
      } else {
        setPageError(err.message);
      }
    }
  };

  // 4. --- Sorting & Filtering --- (Unchanged from last step)
  const getTabClass = (tabName: CrewPageTab): string => {
    // ... (logic unchanged)
    const baseClass = "pb-2 px-1 font-medium transition-colors";
    if (activeTab === tabName) {
      return `${baseClass} text-primary-color border-b-2 border-[#0D6EFD]`;
    }
    return `${baseClass} text-secondary-color hover:text-primary-color`;
  };
  // ... (all other sort/filter logic is unchanged) ...
  const handleSort = (key: keyof PersonnelMember) => {
    // ... (logic unchanged)
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const handleEquipmentSort = (key: keyof EquipmentItem) => {
    // ... (logic unchanged)
    setEquipmentSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const getAvailabilityOrder = (status: PersonnelAvailabilityStatus) =>
    ({
      Available: 1,
      On_Duty: 2,
      Assigned_to_Incident: 3,
      Off_Duty: 4,
    }[status] || 99);

  const getEquipmentStatusOrder = (status: EquipmentStatus) =>
    ({
      Available: 1,
      In_Use: 2,
      Maintenance: 3,
      Out_of_Service: 4,
    }[status] || 99);

  const sortedPersonnel = useMemo(() => {
    // ... (logic unchanged)
    let sortablePersonnel = [...personnel];
    sortablePersonnel.sort((a, b) => {
      const key = sortConfig.key;
      let aValue: string | number | null = a[key];
      let bValue: string | number | null = b[key];

      if (key === "availability_status") {
        aValue = getAvailabilityOrder(a.availability_status);
        bValue = getAvailabilityOrder(b.availability_status);
      }
      
      aValue = aValue ?? "";
      bValue = bValue ?? "";

      if (aValue < bValue)
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue)
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sortablePersonnel;
  }, [personnel, sortConfig]);

  const sortedEquipment = useMemo(() => {
    // ... (logic unchanged)
    let sortableEquipment = [...equipment];
    sortableEquipment.sort((a, b) => {
      const key = equipmentSortConfig.key;
      let aValue: string | number | null = a[key];
      let bValue: string | number | null = b[key];

      if (key === "status") {
        aValue = getEquipmentStatusOrder(a.status);
        bValue = getEquipmentStatusOrder(b.status);
      } else if (key === "last_maintenance_date") {
        aValue = a.last_maintenance_date ? new Date(a.last_maintenance_date).getTime() : 0;
        bValue = b.last_maintenance_date ? new Date(b.last_maintenance_date).getTime() : 0;
      }
      
      aValue = aValue ?? "";
      bValue = bValue ?? "";

      if (aValue < bValue)
        return equipmentSortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue)
        return equipmentSortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sortableEquipment;
  }, [equipment, equipmentSortConfig]);

  // 5. --- Render ---
  const currentItemCount =
    activeTab === "personnel"
      ? sortedPersonnel.length
      : sortedEquipment.length;

  return (
    <div className="space-y-6">
      {/* ... (title and tabs unchanged) ... */}
      <h2 className="text-3xl font-bold text-primary-color">
        Crew & Equipment Management
      </h2>

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

      {/* 🌟 --- Page Error Display --- 🌟 */}
      {pageError && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200 text-sm flex items-center gap-2">
          <FaExclamationTriangle /> {pageError}
        </div>
      )}
      
      {/* 5c. 🌟 Dynamic Controls Bar (Search, Add New) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-grow">
          {/* ... (search input unchanged) ... */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-secondary-color" />
          </div>
          <input
            type="text"
            placeholder={
              activeTab === "personnel"
                ? "Search personnel (name, email, role...)"
                : "Search equipment (type, ID...)"
            }
            className="w-full p-3 h-12 pl-10 form-input rounded-md placeholder-[#ADB5BD]"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() =>
              activeTab === "personnel" ? fetchPersonnel() : fetchEquipment()
            }
            className="btn-main-gray py-2 px-4 rounded-md h-12 justify-center"
            title="Refresh data"
          >
            <FaRedo />
          </button>

          {/* 🌟 Add New Button (Now functional) */}
          <button
            onClick={
              activeTab === "personnel"
                ? handleOpenCreatePersonnel
                : handleOpenCreateEquipment
            }
            className="btn-main-red py-2 px-4 rounded-md h-12 justify-center"
          >
            <FaPlus className="mr-2" />
            {activeTab === "personnel"
              ? "Add New Firefighter"
              : "Add New Equipment"}
          </button>
        </div>
      </div>

      {/* 5d. Dynamic Content */}
      {activeTab === "personnel" ? (
        <PersonnelTable
          personnel={sortedPersonnel}
          sortConfig={sortConfig}
          onSort={handleSort}
          isLoading={personnelLoading}
          error={personnelError}
          onEdit={handleEditPersonnel}
          onDelete={handleDeletePersonnel}
        />
      ) : (
        <EquipmentTable
          equipment={sortedEquipment}
          sortConfig={equipmentSortConfig}
          onSort={handleEquipmentSort}
          isLoading={equipmentLoading}
          error={equipmentError}
          onEdit={handleEditEquipment}
          onDelete={handleDeleteEquipment}
        />
      )}

      {/* 5e. Dynamic Pagination */}
      <div className="flex items-center justify-between mt-6 text-sm">
        <span className="text-secondary-color">
          Showing {currentItemCount} results
        </span>
        {/* ... (pagination controls) ... */}
      </div>

      {/* 6. 🌟 --- The Modal --- 🌟 */}
      <Modal
        isOpen={!!modalMode}
        onClose={handleCloseModal}
        title={
          modalMode?.startsWith("edit-")
            ? `Edit ${activeTab}`
            : `Add New ${activeTab}`
        }
      >
        {/* Show validation error from the server */}
        {crudError && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200 text-sm flex items-center gap-2">
            <FaExclamationTriangle /> {crudError}
          </div>
        )}

        {/* Render Personnel Form */}
        {(modalMode === "create-personnel" ||
          modalMode === "edit-personnel") && (
          <PersonnelForm
            onSubmit={onPersonnelSubmit}
            onCancel={handleCloseModal}
            isSubmitting={isSubmitting}
            isEditMode={modalMode === "edit-personnel"}
            defaultValues={
              editingItem
                ? {
                    ...(editingItem as PersonnelMember),
                    password_hash: "", // Don't pass hash to form
                  }
                : defaultPersonnelForm
            }
          />
        )}

        {/* Render Equipment Form */}
        {(modalMode === "create-equipment" ||
          modalMode === "edit-equipment") && (
          <EquipmentForm
            onSubmit={onEquipmentSubmit}
            onCancel={handleCloseModal}
            isSubmitting={isSubmitting}
            defaultValues={
              editingItem
                ? {
                  ...(editingItem as EquipmentItem),
                  // Ensure date is in YYYY-MM-DD format for input
                  last_maintenance_date: (editingItem as EquipmentItem).last_maintenance_date?.split("T")[0] || "",
                }
                : defaultEquipmentForm
            }
          />
        )}
      </Modal>
    </div>
  );
};

export default CrewManagementPage;