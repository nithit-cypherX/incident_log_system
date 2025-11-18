// File: src/features/crew/components/PersonnelTable.tsx
/**
 * What it does:
 * A "dumb" presentational component that renders the
 * list of personnel in a table.
 *
 * How it works:
 * - Receives 'personnel', 'sortConfig', and 'onSort' props.
 * - Maps over the 'personnel' array to render table rows.
 * - Headers are clickable and call 'onSort'.
 * - Sort icons are displayed.
 * - Uses the 'formatStatusText' util for status badges.
 * - 🌟 The 'personnel.length === 0' check now handles both
 * the initial "empty" state and a "no results" state.
 *
 * How it connects:
 * - Rendered by 'CrewManagementPage.tsx'.
 */

import type { PersonnelMember, PersonnelSortConfig } from "../types/crew.types";
import StatusBadge from "../../../components/ui/StatusBadge";
import {
  // 🌟 Removed FaSpinner, FaExclamationTriangle
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { formatStatusText } from "../../../lib/utils";

// 1. Define the props this component accepts
type PersonnelTableProps = {
  personnel: PersonnelMember[];
  sortConfig: PersonnelSortConfig;
  onSort: (key: keyof PersonnelMember) => void;
};

const PersonnelTable = ({
  personnel,
  sortConfig,
  onSort,
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

  // 3. Helper function to render the table body based on state
  const renderTableBody = () => {
    // 3a. No data state
    // This now handles the initial render (empty array)
    // AND the "no results found" case.
    if (personnel.length === 0) {
      return (
        <tr>
          <td colSpan={8} className="p-8 text-center text-secondary-color">
            No personnel found.
          </td>
        </tr>
      );
    }

    // 3b. Success state: map over the data
    return personnel.map((member) => (
      <tr
        key={member.id}
        className="border-b border-[#495057] hover:bg-[#3A3F44] transition-colors"
      >
        <td className="p-3 text-sm">{member.name}</td>
        <td className="p-3 text-sm">{member.personnel_id}</td>
        <td className="p-3 text-sm">{member.rank_role}</td>
        <td className="p-3 text-sm">{member.station}</td>
        <td className="p-3 text-sm">{member.certifications}</td>
        <td className="p-3 text-sm">
          <StatusBadge
            text={formatStatusText(member.status)}
            type={member.status}
          />
        </td>
        <td className="p-3 text-sm">{member.contact}</td>
        <td className="p-3 text-sm">
          <button className="text-link-color hover:underline">Edit</button>
        </td>
      </tr>
    ));
  };

  // 4. Render the table structure
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px]">
        {/* 4a. Table Header (Unchanged) */}
        <thead className="bg-[#3A3F44]">
          <tr>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("name")}
            >
              Name {getSortIcon("name")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("personnel_id")}
            >
              ID {getSortIcon("personnel_id")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("rank_role")}
            >
              Rank/Role {getSortIcon("rank_role")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("station")}
            >
              Station {getSortIcon("station")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("certifications")}
            >
              Certifications {getSortIcon("certifications")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("status")}
            >
              Status {getSortIcon("status")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("contact")}
            >
              Contact {getSortIcon("contact")}
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

export default PersonnelTable;
