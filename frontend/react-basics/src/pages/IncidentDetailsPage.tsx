/* [File: src/pages/IncidentDetailsPage.tsx] */
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import CurrentCrew from "../components/CurrentCrew";
import IncidentOverview from "../components/IncidentOverview";
import NavBar from "../components/NavBar";
import StatusBadge from "../components/StatusBadge";
import { FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import MapDisplay from "../components/MapDisplay";
import IncidentAttachments from "../components/IncidentAttachments";

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

// --- 🌟 Define types for our API data (UPDATED) ---
type AssignedPersonnel = {
  user_id: number;
  user_name: string;
  role_on_incident: string;
};

// 🌟 NEW: Define the Attachment type based on our database
type Attachment = {
  id: number;
  incident_id: number;
  user_id: number;
  original_file_name: string;
  file_name_on_disk: string;
  file_path_relative: string;
  mime_type: string;
  file_size_bytes: number;
  uploaded_at: string;
};

type IncidentDetails = {
  id: number;
  incident_code: string;
  title: string;
  incident_type: "fire" | "ems" | "rescue" | "hazmat" | "public_assist" | "other";
  status: "active" | "pending" | "closed";
  priority: "high" | "medium" | "low";
  address: string;
  city: string;
  state: string;
  zip_code: string;
  description: string;
  reported_at: string;
  created_by_user_id: number;
  assigned_personnel: AssignedPersonnel[];
  assigned_attachments: Attachment[]; // 🌟 ADDED
};

// --- Main Page Component ---
const IncidentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [incident, setIncident] = useState<IncidentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidentDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/incidents/${id}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        setIncident(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIncidentDetails();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/incident/edit/${id}`);
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this incident and all its related data (personnel, attachments)? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/incidents/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete incident");
      }

      // On success, navigate back to the dashboard
      navigate("/incident-dashboard");
    } catch (e: any) {
      setDeleteError(e.message);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#212529] text-[#F8F9FA] flex justify-center items-center">
        Loading incident details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#212529] text-red-400 flex justify-center items-center">
        Error: {error}
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-[#212529] text-yellow-400 flex justify-center items-center">
        Incident not found.
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-[#212529] text-[#F8F9FA] font-sans">
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Title Area */}
            <div className="mb-6">
              <Link
                to="/incident-dashboard"
                className="text-sm text-[#0D6EFD] hover:underline mb-2 block"
              >
                &larr; Back to Incident Log
              </Link>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Left side: Title */}
                <div>
                  <h2 className="text-3xl font-bold flex items-center">
                    {`Incident ${incident.incident_code}`}
                    <div className="ml-3">
                      <StatusBadge
                        text={
                          incident.status.charAt(0).toUpperCase() +
                          incident.status.slice(1)
                        }
                        type={incident.status}
                      />
                    </div>
                  </h2>
                  <p className="text-lg text-[#ADB5BD] mt-1">
                    {incident.title}
                  </p>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex gap-3 mt-4 md:mt-0">
                  <button
                    onClick={handleEdit}
                    className="btn-main-gray py-2 px-4 rounded-md justify-center"
                    disabled={isDeleting}
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn-main-red py-2 px-4 rounded-md justify-center"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      "Deleting..."
                    ) : (
                      <>
                        <FaTrash className="mr-2" /> Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {deleteError && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-md text-red-200 flex items-center gap-3">
                <FaExclamationTriangle />
                <div>
                  <strong>Error Deleting Incident:</strong> {deleteError}
                </div>
              </div>
            )}

            {/* --- 2-Column Grid Layout (Redesigned) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column (Wider) */}
              <div className="lg:col-span-2 space-y-8">
                <IncidentOverview
                  incidentType={incident.incident_type}
                  location={`${incident.address}, ${incident.city}, ${incident.state}`}
                  reportedAt={formatDate(incident.reported_at)}
                  status={incident.status}
                  priority={incident.priority}
                  description={incident.description}
                />

                <MapDisplay />
                
                {/* 🌟 Pass props to the attachments component */}
                <IncidentAttachments
                  incidentId={incident.id}
                  initialAttachments={incident.assigned_attachments}
                  isReadOnly={true}
                />
              </div>

              {/* Right Column (Narrower) */}
              <div className="lg:col-span-1 space-y-8">
                <CurrentCrew crew={incident.assigned_personnel} />
              </div>
            </div>
            {/* --- End of Grid Layout --- */}
          </div>
        </main>
      </div>
    </>
  );
};

export default IncidentDetailsPage;