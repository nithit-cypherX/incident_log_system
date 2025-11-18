// File: src/features/crew/components/EquipmentTable.tsx
/**
 * What it does:
 * A "dumb" presentational component that renders the
 * list of equipment in a table.
 *
 * How it works:
 * - Receives 'equipment', 'sortConfig', and 'onSort' props.
 * - Maps over the 'equipment' array to render table rows.
 * - Headers are clickable and call 'onSort'.
 * - 🌟 The 'equipment.length === 0' check now handles both
 * the initial "empty" state and a "no results" state.
 *
 * How it connects:
 * - Rendered by 'CrewManagementPage.tsx' when the equipment tab is active.
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
} from "react-icons/fa";
import { formatStatusText } from "../../../lib/utils";

// 1. Define the props this component accepts
type EquipmentTableProps = {
  equipment: EquipmentItem[];
  sortConfig: EquipmentSortConfig;
  onSort: (key: keyof EquipmentItem) => void;
};

const EquipmentTable = ({
  equipment,
  sortConfig,
  onSort,
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

  // 3. Helper function to render the table body based on state
  const renderTableBody = () => {
    // 3a. No data state
    if (equipment.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="p-8 text-center text-secondary-color">
            No equipment found.
          </td>
        </tr>
      );
    }

    // 3b. Success state: map over the data
    return equipment.map((item) => (
      <tr
        key={item.id}
        className="border-b border-[#495057] hover:bg-[#3A3F44] transition-colors"
      >
        <td className="p-3 text-sm">{item.asset_id}</td>
        <td className="p-3 text-sm">{item.type}</td>
        <td className="p-3 text-sm">
          <StatusBadge
            text={formatStatusText(item.status)}
            type={item.status}
          />
        </td>
        <td className="p-3 text-sm">{item.last_maintenance_date}</td>
        <td className="p-3 text-sm">
          <button className="text-link-color hover:underline">Edit</button>
        </td>
      </tr>
    ));
  };

  // 4. Render the table structure
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        {/* 4a. Table Header (Unchanged) */}
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
              {/* Action column, no sort */}
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