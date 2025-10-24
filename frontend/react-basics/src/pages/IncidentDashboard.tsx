import React, { useState, useMemo } from "react";
import Header from "../components/NavBar";
import StatusBadge from "../components/StatusBadge";
import {
  FaPlus,
  FaSearch,
  FaRedo,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

// Types
type IncidentStatus = "active" | "closed" | "pending";
type IncidentPriority = "high" | "medium" | "low";

type Incident = {
  id: string;
  type: string;
  date: string;
  address: string;
  status: IncidentStatus;
  crew: string;
  priority: IncidentPriority;
};

type FilterState = {
  status: string;
  incidentType: string;
  dateRange: string;
  assignedCrew: string;
  priority: string;
};

type SortDirection = "ascending" | "descending";

const defaultFilters: FilterState = {
  status: "all",
  incidentType: "all",
  dateRange: "all",
  assignedCrew: "all",
  priority: "all",
};

// --- Reusable Filter Dropdown ---
type FilterDropdownProps = {
  label: string;
  children: React.ReactNode;
  name: keyof FilterState;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const FilterDropdown = ({
  label,
  children,
  name,
  value,
  onChange,
}: FilterDropdownProps) => (
  <div>
    <label className="block text-xs font-medium text-primary-color mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 h-11 form-input rounded-md"
    >
      {children}
    </select>
  </div>
);

// --- Mock Data ---
const mockIncidents: Incident[] = [
  {
    id: "INC-2023-00123",
    type: "Fire",
    date: "2023-10-26 14:30",
    address: "123 Main St, Anytown",
    status: "active",
    crew: "Engine 1",
    priority: "high",
  },
  {
    id: "INC-2023-00122",
    type: "EMS",
    date: "2023-10-26 11:15",
    address: "456 Oak Ave, Sector 4",
    status: "closed",
    crew: "Medic 2",
    priority: "medium",
  },
  {
    id: "INC-2023-00121",
    type: "Rescue",
    date: "2023-10-25 09:05",
    address: "789 Pine Ln, Downtown",
    status: "pending",
    crew: "Rescue 1",
    priority: "medium",
  },
  {
    id: "INC-2023-00120",
    type: "HAZMAT",
    date: "2023-10-24 17:45",
    address: "101 Industrial Pkwy",
    status: "closed",
    crew: "HAZMAT 1",
    priority: "low",
  },
  {
    id: "INC-2023-00119",
    type: "Fire",
    date: "2023-10-23 08:20",
    address: "555 Elm St, Uptown",
    status: "active",
    crew: "Engine 2",
    priority: "high",
  },
  {
    id: "INC-2023-00118",
    type: "EMS",
    date: "2023-10-22 16:55",
    address: "222 Maple Dr, Westside",
    status: "closed",
    crew: "Medic 3",
    priority: "low",
  },
];

// --- Main Page Component ---
const IncidentDashboard = () => {
  // State for filters
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // State for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Incident;
    direction: SortDirection;
  }>({
    key: "date",
    direction: "descending",
  });

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  // Handle sorting
  const handleSort = (key: keyof Incident) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // Helper to get date for comparison
  const getDateValue = (dateString: string) => {
    return new Date(dateString).getTime();
  };

  // Helper to get status sort order
  const getStatusOrder = (status: IncidentStatus): number => {
    const order = { active: 1, pending: 2, closed: 3 };
    return order[status];
  };

  // Helper to get priority sort order
  const getPriorityOrder = (priority: IncidentPriority): number => {
    const order = { high: 1, medium: 2, low: 3 };
    return order[priority];
  };

  // Helper to check date range
  const isInDateRange = (dateString: string, range: string): boolean => {
    if (range === "all") return true;

    const incidentDate = new Date(dateString);
    const today = new Date();
    const daysDiff = Math.floor(
      (today.getTime() - incidentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (range === "today") {
      return daysDiff === 0;
    } else if (range === "week") {
      return daysDiff <= 7;
    }
    return true;
  };

  // Filter and sort incidents
  const filteredAndSortedIncidents = useMemo(() => {
    let result = [...mockIncidents];

    // Apply status filter
    if (filters.status !== "all") {
      result = result.filter(
        (incident) => incident.status === filters.status.toLowerCase()
      );
    }

    // Apply incident type filter
    if (filters.incidentType !== "all") {
      result = result.filter(
        (incident) =>
          incident.type.toLowerCase() === filters.incidentType.toLowerCase()
      );
    }

    // Apply date range filter
    if (filters.dateRange !== "all") {
      result = result.filter((incident) =>
        isInDateRange(incident.date, filters.dateRange)
      );
    }

    // Apply crew filter
    if (filters.assignedCrew !== "all") {
      result = result.filter(
        (incident) => incident.crew === filters.assignedCrew
      );
    }

    // Apply priority filter
    if (filters.priority !== "all") {
      result = result.filter(
        (incident) => incident.priority === filters.priority.toLowerCase()
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const key = sortConfig.key;
      let aValue: string | number = a[key];
      let bValue: string | number = b[key];

      // Special handling for different column types
      if (key === "date") {
        aValue = getDateValue(a.date);
        bValue = getDateValue(b.date);
      } else if (key === "status") {
        aValue = getStatusOrder(a.status);
        bValue = getStatusOrder(b.status);
      } else if (key === "priority") {
        aValue = getPriorityOrder(a.priority);
        bValue = getPriorityOrder(b.priority);
      }

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [filters, sortConfig]);

  // Helper function to render the correct sort icon
  const getSortIcon = (key: keyof Incident) => {
    if (sortConfig.key !== key) {
      return <FaSort className="inline ml-1 opacity-30" />;
    }
    if (sortConfig.direction === "ascending") {
      return <FaSortUp className="inline ml-1" />;
    }
    return <FaSortDown className="inline ml-1" />;
  };

  return (
    <div className="min-h-screen bg-[#212529] text-primary-color font-primary flex flex-col">
      <Header title="Fire Incident Log" />

      <main className="flex-grow p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto bg-[#2C3034] p-6 rounded-lg shadow-lg">
          {/* Page Title & Button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Incident Log</h2>
            <button className="btn-main-red py-2 px-4 rounded-md">
              <FaPlus className="mr-2" />
              Log New Incident
            </button>
          </div>

          {/* Search and Filter Controls */}
          <div className="space-y-4 mb-6">
            {/* Search Bar - Backend will handle this */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-secondary-color" />
              </div>
              <input
                type="text"
                placeholder="Search Incidents (ID, Address, Keyword...)"
                className="w-full p-3 h-12 pl-10 form-input rounded-md placeholder-[#ADB5BD]"
              />
            </div>

            {/* Filter Panel */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <FilterDropdown
                label="Status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
              </FilterDropdown>

              <FilterDropdown
                label="Incident Type"
                name="incidentType"
                value={filters.incidentType}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="fire">Fire</option>
                <option value="ems">EMS</option>
                <option value="rescue">Rescue</option>
                <option value="hazmat">HAZMAT</option>
              </FilterDropdown>

              <FilterDropdown
                label="Date Range"
                name="dateRange"
                value={filters.dateRange}
                onChange={handleFilterChange}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
              </FilterDropdown>

              <FilterDropdown
                label="Assigned Crew"
                name="assignedCrew"
                value={filters.assignedCrew}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="Engine 1">Engine 1</option>
                <option value="Engine 2">Engine 2</option>
                <option value="Medic 2">Medic 2</option>
                <option value="Medic 3">Medic 3</option>
                <option value="Rescue 1">Rescue 1</option>
                <option value="HAZMAT 1">HAZMAT 1</option>
              </FilterDropdown>

              <FilterDropdown
                label="Priority"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </FilterDropdown>

              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full p-2 h-11 bg-transparent text-link-color hover:bg-blue-900/20 font-semibold rounded-md flex items-center justify-center transition-colors"
                >
                  <FaRedo className="mr-2 text-sm" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Incident List Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              {/* Table Header */}
              <thead className="bg-[#3A3F44]">
                <tr>
                  <th
                    className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
                    onClick={() => handleSort("id")}
                  >
                    Incident ID {getSortIcon("id")}
                  </th>
                  <th
                    className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
                    onClick={() => handleSort("type")}
                  >
                    Type {getSortIcon("type")}
                  </th>
                  <th
                    className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
                    onClick={() => handleSort("date")}
                  >
                    Date/Time {getSortIcon("date")}
                  </th>
                  <th
                    className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
                    onClick={() => handleSort("address")}
                  >
                    Address {getSortIcon("address")}
                  </th>
                  <th
                    className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
                    onClick={() => handleSort("status")}
                  >
                    Status {getSortIcon("status")}
                  </th>
                  <th
                    className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
                    onClick={() => handleSort("crew")}
                  >
                    Crew {getSortIcon("crew")}
                  </th>
                  <th
                    className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
                    onClick={() => handleSort("priority")}
                  >
                    Priority {getSortIcon("priority")}
                  </th>
                  <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredAndSortedIncidents.length > 0 ? (
                  filteredAndSortedIncidents.map((incident) => (
                    <tr
                      key={incident.id}
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
                      <td className="p-3 text-sm">{incident.crew}</td>
                      <td className="p-3 text-sm">
                        <StatusBadge
                          text={
                            incident.priority.charAt(0).toUpperCase() +
                            incident.priority.slice(1)
                          }
                          type={incident.priority}
                        />
                      </td>
                      <td className="p-3 text-sm text-center text-[#ADB5BD]">
                        <FaEye className="hover:text-white inline cursor-pointer" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-8 text-center text-secondary-color"
                    >
                      No incidents found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6 text-sm">
            <span className="text-secondary-color">
              Showing {filteredAndSortedIncidents.length} of{" "}
              {mockIncidents.length} Incidents
            </span>
            <div className="flex gap-2">
              <button
                className="py-2 px-4 btn-main-gray rounded-md disabled:opacity-40"
                disabled
              >
                Previous
              </button>
              <button
                className="py-2 px-4 btn-main-gray rounded-md disabled:opacity-40"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncidentDashboard;
