import React from 'react';
import CurrentCrew from '../components/CurrentCrew';
import IncidentTabs from '../components/IncidentTabs';
import IncidentOverview from '../components/IncidentOverview';
import MapDisplay from '../components/MapDisplay';

// --- Mock Data (Stays on the page level) ---
const mockIncident = {
  id: "#2023-10-27-001",
  title: "Structure Fire at 123 Oak Street",
  type: "Structure Fire",
  location: "123 Oak Street, Anytown, USA",
  reportedAt: "October 27, 2023, 14:35",
  status: "Active" as const,
};

// --- Main Page Component ---
const IncidentDetailsPage = () => {
  return (
    <div className="min-h-screen bg-[#212529] text-[#F8F9FA] font-sans"> 
      <main className="p-8"> 
        <div className="max-w-7xl mx-auto">
          
          {/* Page Title Area */}
          <div className="mb-6">
            <a href="#" className="text-sm text-[#0D6EFD] hover:underline mb-2 block">
              &larr; Back to Incident Log
            </a>
            <h2 className="text-3xl font-bold flex items-center">
              {`Incident ${mockIncident.id}`}
              <span className="ml-3 text-sm font-medium bg-green-600 text-white px-3 py-1 rounded-full">
                {mockIncident.status}
              </span>
            </h2>
            <p className="text-lg text-[#ADB5BD] mt-1">{mockIncident.title}</p>
          </div>
          
          <IncidentTabs />

          {/* --- 2-Column Grid Layout --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* 3. Use the new IncidentOverview component */}
              <IncidentOverview 
                incidentType={mockIncident.type}
                location={mockIncident.location}
                reportedAt={mockIncident.reportedAt}
                status={mockIncident.status}
              />

              {/* 4. Use the new MapDisplay component */}
              <MapDisplay />

            </div>

            {/* Right Column (Sidebar) */}
            <div className="lg:col-span-1">
              <CurrentCrew />
            </div>

          </div>
          {/* --- End of Grid Layout --- */}

        </div>
      </main>
    </div>
  );
};

export default IncidentDetailsPage;