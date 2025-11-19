// File: src/features/crew/components/PersonnelTable.tsx
/**
 * What it does:
 * A "dumb" presentational component that renders the
 * list of personnel in a table.
 *
 * 🌟 --- UPDATED --- 🌟
 * - Now accepts 'isLoading' and 'error' props.
 * - Renders loading/error/empty states.
 * - Adds an "Actions" column with 'onEdit' and 'onDelete' handlers.
 * - Uses the REAL database types (no 'formatStatusText').
 * - Columns now match the 'users' table.
 */

import type { PersonnelMember, PersonnelSortConfig } from "../types/crew.types";
import StatusBadge from "../../../components/ui/StatusBadge";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSpinner, // 🌟 Added
  FaExclamationTriangle, // 🌟 Added
} from "react-icons/fa";

// 1. 🌟 Define the new props this component accepts
type PersonnelTableProps = {
  personnel: PersonnelMember[];
  sortConfig: PersonnelSortConfig;
  onSort: (key: keyof PersonnelMember) => void;
  isLoading: boolean; // 🌟 Added
  error: string | null; // 🌟 Added
  onEdit: (member: PersonnelMember) => void; // 🌟 Added
  onDelete: (member: PersonnelMember) => void; // 🌟 Added
};

const PersonnelTable = ({
  personnel,
  sortConfig,
  onSort,
  isLoading, // 🌟 Added
  error, // 🌟 Added
  onEdit, // 🌟 Added
  onDelete, // 🌟 Added
}: PersonnelTableProps) => {
  // 2. Helper to get the correct sort icon
  const getSortIcon = (key: keyof PersonnelMember) => {
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
          <td colSpan={8} className="p-8 text-center text-secondary-color">
            <FaSpinner className="animate-spin inline mr-2" />
            Loading personnel...
          </td>
        </tr>
      );
    }
    // 3b. Error state
    if (error) {
      return (
        <tr>
          <td colSpan={8} className="p-8 text-center text-red-400">
            <FaExclamationTriangle className="inline mr-2" />
            Error: {error}
          </td>
        </tr>
      );
    }
    // 3c. No data state
    if (personnel.length === 0) {
      return (
        <tr>
          <td colSpan={8} className="p-8 text-center text-secondary-color">
            No personnel found.
          </td>
        </tr>
      );
    }

    // 3d. Success state: map over the data
    return personnel.map((member) => (
      <tr
        key={member.id}
        className="border-b border-[#495057] hover:bg-[#3A3F44] transition-colors"
      >
        <td className="p-3 text-sm">{member.full_name}</td>
        <td className="p-3 text-sm">{member.email}</td>
        <td className="p-3 text-sm">{member.role}</td>
        <td className="p-3 text-sm">{member.ranks || "N/A"}</td>
        <td className="p-3 text-sm">
          {/* 🌟 We use 'availability_status' for the badge */}
          <StatusBadge
            text={member.availability_status.replace("_", " ")}
            type={
              member.availability_status as
                | "available"
                | "on_duty"
                | "on_leave"
            }
          />
        </td>
        <td className="p-3 text-sm">
          <StatusBadge
            text={member.status}
            type={member.status === "Active" ? "available" : "maintenance"}
          />
        </td>
        <td className="p-3 text-sm">
          <button
            onClick={() => onEdit(member)}
            className="text-link-color hover:underline mr-4"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(member)}
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
      <table className="w-full min-w-[1100px]">
        {/* 4a. 🌟 Table Header (Updated columns) */}
        <thead className="bg-[#3A3F44]">
          <tr>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("full_name")}
            >
              Name {getSortIcon("full_name")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("email")}
            >
              Email {getSortIcon("email")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("role")}
            >
              Role {getSortIcon("role")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("ranks")}
            >
              Ranks {getSortIcon("ranks")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("availability_status")}
            >
              Availability {getSortIcon("availability_status")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("status")}
            >
              Status {getSortIcon("status")}
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

export default PersonnelTable;