// File: src/features/incident/pages/IncidentDashboardPage.tsx
/**
 * What it does:
 * The "smart" page for the Incident Log.
 *
 * How it works:
 * - Manages all state: 'allIncidents', 'isLoading', 'error',
 * 'filters', 'searchQuery', 'sortConfig'.
 * - Uses 'useEffect' to fetch data from 'incidentService'
 * whenever the 'debouncedQuery' changes.
 * - Contains all helper functions for sorting and filtering.
 * - Renders the "dumb" <IncidentListTable> and provides
 * it with all the data and functions it needs.
 *
 * How it connects:
 * - 'App.tsx' routes '/incident-dashboard' to this page.
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaRedo } from "react-icons/fa";
import { incidentService } from "../services/incidentService";
// 🌟 --- FIX: Import the types from the shared file --- 🌟
import type {
  IncidentListItem,
  FilterState,
  SortConfig,
} from "../types/incident.types";
import { formatDate } from "../../../lib/utils";
import IncidentListTable from "../components/IncidentListTable";

// --- Reusable Filter Dropdown (local component) ---
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
// --- End Filter Dropdown ---

// --- Main Page Component ---
const IncidentDashboardPage = () => {
  const navigate = useNavigate();

  // API data state
  const [allIncidents, setAllIncidents] = useState<IncidentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    incidentType: "all",
    priority: "all",
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Sort state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "descending",
  });

  // Debounce effect for the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Wait 500ms after user stops typing
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Main data fetching effect
  useEffect(() => {
    const fetchIncidents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let data;
        if (debouncedQuery) {
          data = await incidentService.searchIncidents(debouncedQuery);
        } else {
          data = await incidentService.getAllIncidents();
        }

        // Transform data (This is now done in the service, but
        // we keep the front-end type mapping here for clarity)
        const formattedIncidents: IncidentListItem[] = data.map((item: any) => ({
          db_id: item.id,
          id: item.incident_code,
          type: item.incident_type,
          date: formatDate(item.reported_at),
          address: item.address,
          status: item.status,
          priority: item.priority,
        }));
        setAllIncidents(formattedIncidents);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncidents();
  }, [debouncedQuery]); // Re-run whenever the DEBOUNCED query changes

  // Row click handler
  const handleRowClick = (id: number) => {
    navigate(`/incident/${id}`);
  };

  // Filter change handler
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setFilters({
      status: "all",
      incidentType: "all",
      priority: "all",
    });
    setSearchQuery("");
  };

  // Sort handler
  const handleSort = (key: keyof IncidentListItem) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // --- Helper functions for sorting (local to this component) ---
  const getDateValue = (dateString: string) => new Date(dateString).getTime();
  const getStatusOrder = (status: string) =>
    ({ active: 1, pending: 2, closed: 3 }[status] || 99);
  const getPriorityOrder = (priority: string) =>
    ({ high: 1, medium: 2, low: 3 }[priority] || 99);

  // Filter and sort incidents (this is client-side)
  const filteredAndSortedIncidents = useMemo(() => {
    let result = [...allIncidents];

    // Apply filters
    if (filters.status !== "all") {
      result = result.filter((inc) => inc.status === filters.status);
    }
    if (filters.incidentType !== "all") {
      result = result.filter((inc) => inc.type === filters.incidentType);
    }
    if (filters.priority !== "all") {
      result = result.filter((inc) => inc.priority === filters.priority);
    }

    // Apply sorting
    result.sort((a, b) => {
      const key = sortConfig.key;
      let aValue: string | number = (a as any)[key];
      let bValue: string | number = (b as any)[key];

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

      if (aValue < bValue)
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue)
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });

    return result;
  }, [filters, sortConfig, allIncidents]);

  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg">
      {/* Page Title & Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Incident Log</h2>
        <button
          onClick={() => navigate("/incident/new")}
          className="btn-main-red py-2 px-4 rounded-md"
        >
          <FaPlus className="mr-2" />
          Log New Incident
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-secondary-color" />
          </div>
          <input
            type="text"
            placeholder="Search Incidents (ID, Address, Keyword...)"
            className="w-full p-3 h-12 pl-10 form-input rounded-md placeholder-[#ADB5BD]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <option value="public_assist">Public Assist</option>
            <option value="other">Other</option>
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

      {/* The "Dumb" Table Component */}
      <IncidentListTable
        incidents={filteredAndSortedIncidents}
        isLoading={isLoading}
        error={error}
        sortConfig={sortConfig}
        onSort={handleSort}
        onRowClick={handleRowClick}
      />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6 text-sm">
        <span className="text-secondary-color">
          Showing {filteredAndSortedIncidents.length} results
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
  );
};

export default IncidentDashboardPage;