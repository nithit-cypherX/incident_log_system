// File: src/features/incident/components/IncidentListTable.tsx
/**
 * What it does:
 * A "dumb" component that renders the table of incidents.
 *
 * How it works:
 * - Receives 'incidents', 'isLoading', 'error' as props.
 * - Receives 'onRowClick' and 'onSort' as callback props.
 * - It has no state of its own; it just renders based on props.
 *
 * How it connects:
 * - 'IncidentDashboardPage.tsx' renders this and provides
 * all the data and callbacks.
 */

import {
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import StatusBadge from "../../../components/ui/StatusBadge";
import type { IncidentListItem, SortConfig } from "../types/incident.types";

// Props for the table
type IncidentListTableProps = {
  incidents: IncidentListItem[];
  isLoading: boolean;
  error: string | null;
  sortConfig: SortConfig;
  onRowClick: (id: number) => void;
  onSort: (key: keyof IncidentListItem) => void;
};

const IncidentListTable = ({
  incidents,
  isLoading,
  error,
  sortConfig,
  onRowClick,
  onSort,
}: IncidentListTableProps) => {
  // Helper to get the correct sort icon
  const getSortIcon = (key: keyof IncidentListItem) => {
    if (sortConfig.key !== key) {
      return <FaSort className="inline ml-1 opacity-30" />;
    }
    if (sortConfig.direction === "ascending") {
      return <FaSortUp className="inline ml-1" />;
    }
    return <FaSortDown className="inline ml-1" />;
  };

  // Render logic for the table body
  const renderBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={6} className="p-8 text-center text-secondary-color">
            Loading incidents...
          </td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan={6} className="p-8 text-center text-red-400">
            Error fetching data: {error}
          </td>
        </tr>
      );
    }
    if (incidents.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="p-8 text-center text-secondary-color">
            No incidents found matching your search or filters.
          </td>
        </tr>
      );
    }
    return incidents.map((incident) => (
      <tr
        key={incident.id}
        onClick={() => onRowClick(incident.db_id)}
        className="border-b border-[#495057] hover:bg-[#3A3F44] transition-colors cursor-pointer"
      >
        <td className="p-3 text-sm">{incident.id}</td>
        <td className="p-3 text-sm">{incident.type}</td>
        <td className="p-3 text-sm">{incident.date}</td>
        <td className="p-3 text-sm">{incident.address}</td>
        <td className="p-3 text-sm">
          <StatusBadge
            text={
              incident.status.charAt(0).toUpperCase() +
              incident.status.slice(1)
            }
            type={incident.status}
          />
        </td>
        <td className="p-3 text-sm">
          <StatusBadge
            text={
              incident.priority.charAt(0).toUpperCase() +
              incident.priority.slice(1)
            }
            type={incident.priority}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        {/* Table Header */}
        <thead className="bg-[#3A3F44]">
          <tr>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("id")}
            >
              Incident ID {getSortIcon("id")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("type")}
            >
              Type {getSortIcon("type")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("date")}
            >
              Date/Time {getSortIcon("date")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("address")}
            >
              Address {getSortIcon("address")}
            </th>

            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a5c]"
              onClick={() => onSort("status")}
            >
              Status {getSortIcon("status")}
            </th>
            <th
              className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
              onClick={() => onSort("priority")}
            >
              Priority {getSortIcon("priority")}
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>{renderBody()}</tbody>
      </table>
    </div>
  );
};

export default IncidentListTable;