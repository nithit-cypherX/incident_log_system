import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Import hooks for routing
import CurrentCrew from "../components/CurrentCrew";
import IncidentTabs from "../components/IncidentTabs";
import IncidentOverview from "../components/IncidentOverview";
import MapDisplay from "../components/MapDisplay";
import NavBar from "../components/NavBar"; // Added for consistency
import StatusBadge from "../components/StatusBadge"; // Import shared badge

// --- 🌟 NEW: Helper function to format date string ---
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

// --- 🌟 NEW: Define types for our API data ---
type AssignedPersonnel = {
  user_id: number;
  user_name: string;
  role_on_incident: string;
};

type IncidentDetails = {
  id: number;
  incident_code: string;
  title: string;
  // 💡 FIXED: 'other' is allowed for incident_type
  incident_type: 'fire' | 'ems' | 'rescue' | 'hazmat' | 'public_assist' | 'other';
  // 💡 FIXED: 'other' removed from status
  status: 'active' | 'pending' | 'closed';
  priority: 'high' | 'medium' | 'low';
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  description: string;
  reported_at: string;
  created_by_user_id: number;
  assigned_personnel: AssignedPersonnel[];
};

// --- Main Page Component ---
const IncidentDetailsPage = () => {
  // 1. Get the 'id' from the URL (e.g., /incident/:id)
  const { id } = useParams<{ id: string }>();
  
  // 2. Set up state for data, loading, and errors
  const [incident, setIncident] = useState<IncidentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Fetch data when the component loads
  useEffect(() => {
    const fetchIncidentDetails = async () => {
      try {
        // ✅ This endpoint is correct per your server.js
        const response = await fetch(`http://localhost:3000/api/v1/incidents/${id}`);
        
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
  }, [id]); // Re-run this effect if the ID in the URL changes

  // 4. Show loading or error messages
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

  // 5. Render the page with real data
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-[#212529] text-[#F8F9FA] font-sans">
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Title Area (with real data) */}
            <div className="mb-6">
              <Link to="/incident-dashboard" className="text-sm text-[#0D6EFD] hover:underline mb-2 block">
                &larr; Back to Incident Log
              </Link>
              <h2 className="text-3xl font-bold flex items-center">
                {`Incident ${incident.incident_code}`}
                <div className="ml-3">
                  <StatusBadge
                    text={incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    type={incident.status}
                  />
                </div>
              </h2>
              <p className="text-lg text-[#ADB5BD] mt-1">{incident.title}</p>
            </div>
            
            <IncidentTabs />

            {/* --- 2-Column Grid Layout --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column (with real data) */}
              <div className="lg:col-span-2 space-y-8">
                
                <IncidentOverview
                  incidentType={incident.incident_type}
                  location={`${incident.address}, ${incident.city}, ${incident.state}`}
                  reportedAt={formatDate(incident.reported_at)}
                  status={incident.status}
                  priority={incident.priority}
                  description={incident.description}
                />

                <MapDisplay
                  lat={incident.latitude}
                  lon={incident.longitude}
                />

              </div>

              {/* Right Column (with real data) */}
              <div className="lg:col-span-1">
                {/* Pass the real crew data from our API fetch */}
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