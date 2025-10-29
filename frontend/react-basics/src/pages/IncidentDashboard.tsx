import React, { useState, useMemo, useEffect } from "react";
// 🌟 1. Import useNavigate (already here, just confirming)
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import StatusBadge from "../components/StatusBadge";
import {
  FaPlus,
  FaSearch,
  FaRedo,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

// Types
type IncidentStatus = "active" | "closed" | "pending";
type IncidentPriority = "high" | "medium" | "low";

type Incident = {
  db_id: number;
  id: string; // incident_code
  type: string; // incident_type
  date: string; // formatted reported_at
  address: string;
  status: IncidentStatus;
  priority: IncidentPriority;
};

type FilterState = {
  status: string;
  incidentType: string;
  priority: string;
};

type SortDirection = "ascending" | "descending";

const defaultFilters: FilterState = {
  status: "all",
  incidentType: "all",
  priority: "all",
};

// --- Reusable Filter Dropdown (No change) ---
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

// --- Helper function to format date string (No change) ---
const formatDate = (isoString: string) => {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (e) {
    console.error("Invalid date:", isoString);
    return "Invalid Date";
  }
};

// --- Main Page Component ---
const IncidentDashboard = () => {
  const navigate = useNavigate();

  // API data state
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // 🌟 NEW: State for the search bar input
  const [searchQuery, setSearchQuery] = useState("");
  // 🌟 NEW: State for the debounced search term (to avoid API calls on every key press)
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Sort state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Incident;
    direction: SortDirection;
  }>({
    key: "date",
    direction: "descending",
  });

  // 🌟 NEW: Debounce effect for the search input
  useEffect(() => {
    // Set up a timer
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    // Clear the timer if the user types again
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]); // This effect runs every time 'searchQuery' changes

  // 🌟 UPDATED: useEffect to fetch data based on the debounced search query
  useEffect(() => {
    const fetchIncidents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let url;
        if (debouncedQuery) {
          // If there's a search term, use the NEW search endpoint
          url = `http://localhost:3000/api/v1/incidents/search?q=${encodeURIComponent(
            debouncedQuery
          )}`;
        } else {
          // Otherwise, get all incidents
          url = "http://localhost:3000/api/v1/incidents";
        }

        const response = await fetch(url, { credentials: "include" });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch: ${response.status} ${response.statusText}`
          );
        }

        const dbData = await response.json();

        // Transform the DB data to match our frontend `Incident` type
        const formattedIncidents: Incident[] = dbData.map((item: any) => ({
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
  }, [debouncedQuery]); // 🌟 Re-run whenever the DEBOUNCED query changes

  // Row click handler (No change)
  const handleRowClick = (id: number) => {
    navigate(`/incident/${id}`);
  };

  // Filter change handler (No change)
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset filters handler (No change)
  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery(""); // 🌟 Also reset the search query
  };

  // Sort handler (No change)
  const handleSort = (key: keyof Incident) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // --- Helper functions for sorting (No change) ---
  const getDateValue = (dateString: string) => {
    return new Date(dateString).getTime();
  };
  const getStatusOrder = (status: IncidentStatus): number => {
    const order = { active: 1, pending: 2, closed: 3 };
    return order[status] || 99;
  };
  const getPriorityOrder = (priority: IncidentPriority): number => {
    const order = { high: 1, medium: 2, low: 3 };
    return order[priority];
  };

  // Filter and sort incidents (No change, this runs *after* API results are back)
  const filteredAndSortedIncidents = useMemo(() => {
    let result = [...allIncidents];

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
    // Apply priority filter
    if (filters.priority !== "all") {
      result = result.filter(
        (incident) => incident.priority === filters.priority.toLowerCase()
      );
    }
    // Apply sorting
    result.sort((a, b) => {
      const key = sortConfig.key;
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
      let aValue: string | number = a[key];
      let bValue: string | number = b[key];
      if (key === "date") {
        aValue = getDateValue(a.date);
        bValue = getDateValue(b.date);
      } else if (key === "status") {
        aValue = getStatusOrder(a.status);
        bValue = getStatusOrder(b.status);
      } else if (key === "priority") {
        aValue = getPriorityOrder(a.priority);
        bValue = getPriorityOrder(a.priority);
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
  }, [filters, sortConfig, allIncidents]);

  // Sort icon helper (No change)
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
      <NavBar />

      <main className="flex-grow p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto bg-[#2C3034] p-6 rounded-lg shadow-lg">
          {/* Page Title & Button (No change) */}
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
            {/* 🌟 UPDATED Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-secondary-color" />
              </div>
              <input
                type="text"
                placeholder="Search Incidents (ID, Address, Keyword...)"
                className="w-full p-3 h-12 pl-10 form-input rounded-md placeholder-[#ADB5BD]"
                value={searchQuery} // 🌟 Set value from state
                onChange={(e) => setSearchQuery(e.target.value)} // 🌟 Update state on change
              />
            </div>

            {/* Filter Panel (No change) */}
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

          {/* Incident List Table (No change in structure) */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              {/* Table Header (No change) */}
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
                    className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a5c]"
                    onClick={() => handleSort("status")}
                  >
                    Status {getSortIcon("status")}
                  </th>
                  <th
                    className="p-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#434a52]"
                    onClick={() => handleSort("priority")}
                  >
                    Priority {getSortIcon("priority")}
                  </th>
                </tr>
              </thead>

              {/* Table Body - (No change in logic, just uses updated data) */}
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-secondary-color"
                    >
                      Loading incidents...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-red-400"
                    >
                      Error fetching data: {error}
                    </td>
                  </tr>
                ) : filteredAndSortedIncidents.length > 0 ? (
                  filteredAndSortedIncidents.map((incident) => (
                    <tr
                      key={incident.id}
                      onClick={() => handleRowClick(incident.db_id)}
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
                            incident.status.slice(1).replace("_", " ")
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
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-secondary-color"
                    >
                      {/* 🌟 Updated message to be more accurate */}
                      No incidents found matching your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls (No change) */}
          <div className="flex items-center justify-between mt-6 text-sm">
            <span className="text-secondary-color">
              Showing {filteredAndSortedIncidents.length} of{" "}
              {allIncidents.length} Incidents
              {/* This text is now more dynamic. If you search, it might say "Showing 1 of 1 Incidents" */}
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