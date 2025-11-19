// File: src/features/crew/components/EquipmentTable.tsx
/**
 * What it does:
 * A "dumb" presentational component that renders the
 * list of equipment in a table.
 *
 * 🌟 --- UPDATED --- 🌟
 * - Now accepts 'isLoading' and 'error' props.
 * - Renders loading/error/empty states.
 * - Adds an "Actions" column with 'onEdit' and 'onDelete' handlers.
 * - Uses the REAL database types (no 'formatStatusText').
 * - Columns now match the 'equipment' table.
 */

import type {
  EquipmentItem,
  EquipmentSortConfig,
} from "../types/crew.types";
import StatusBadge from "../../../components/ui/StatusBadge";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSpinner, // 🌟 Added
  FaExclamationTriangle, // 🌟 Added
} from "react-icons/fa";

// 1. 🌟 Define the new props this component accepts
type EquipmentTableProps = {
  equipment: EquipmentItem[];
  sortConfig: EquipmentSortConfig;
  onSort: (key: keyof EquipmentItem) => void;
  isLoading: boolean; // 🌟 Added
  error: string | null; // 🌟 Added
  onEdit: (item: EquipmentItem) => void; // 🌟 Added
  onDelete: (item: EquipmentItem) => void; // 🌟 Added
};

const EquipmentTable = ({
  equipment,
  sortConfig,
  onSort,
  isLoading, // 🌟 Added
  error, // 🌟 Added
  onEdit, // 🌟 Added
  onDelete, // 🌟 Added
}: EquipmentTableProps) => {
  // 2. Helper to get the correct sort icon
  const getSortIcon = (key: keyof EquipmentItem) => {
    if (sortConfig.key !== key) {
      return <FaSort className="inline ml-1 opacity-30" />;
    }
    if (sortConfig.direction === "ascending") {
      return <FaSortUp className="inline ml-1" />;
    }
    return <FaSortDown className="inline ml-1" />;
  };

  // 3. 🌟 Helper function to render the table body based on state
  const renderTableBody = () => {
    // 3a. Loading state
    if (isLoading) {
      return (
        <tr>
          <td colSpan={5} className="p-8 text-center text-secondary-color">
            <FaSpinner className="animate-spin inline mr-2" />
            Loading equipment...
          </td>
        </tr>
      );
    }
    // 3b. Error state
    if (error) {
      return (
        <tr>
          <td colSpan={5} className="p-8 text-center text-red-400">
            <FaExclamationTriangle className="inline mr-2" />
            Error: {error}
          </td>
        </tr>
      );
    }
    // 3c. No data state
    if (equipment.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="p-8 text-center text-secondary-color">
            No equipment found.
          </td>
        </tr>
      );
    }

    // 3d. Success state: map over the data
    return equipment.map((item) => (
      <tr
        key={item.id}
        className="border-b border-[#495057] hover:bg-[#3A3F44] transition-colors"
      >
        <td className="p-3 text-sm">{item.asset_id}</td>
        <td className="p-3 text-sm">{item.type}</td>
        <td className="p-3 text-sm">
          <StatusBadge
            text={item.status.replace("_", " ")}
            type={
              item.status.toLowerCase() as
                | "available"
                | "in_use"
                | "maintenance"
                | "out_of_service"
            }
          />
        </td>
        <td className="p-3 text-sm">{item.last_maintenance_date || "N/A"}</td>
        <td className="p-3 text-sm">
          <button
            onClick={() => onEdit(item)}
            className="text-link-color hover:underline mr-4"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  // 4. Render the table structure
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        {/* 4a. 🌟 Table Header (Updated) */}
        <thead className="bg-[#3A3F44]">
          <tr>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("asset_id")}
            >
              Asset ID {getSortIcon("asset_id")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("type")}
            >
              Type {getSortIcon("type")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("status")}
            >
              Status {getSortIcon("status")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("last_maintenance_date")}
            >
              Last Maintenance {getSortIcon("last_maintenance_date")}
            </th>
            <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        {/* 4b. Table Body (rendered by our helper) */}
        <tbody>{renderTableBody()}</tbody>
      </table>
    </div>
  );
};

export default EquipmentTable;