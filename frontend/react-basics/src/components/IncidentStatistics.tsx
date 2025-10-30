// src/components/IncidentStatistics.tsx

// 1. Remove the unused 'React' import
import RecentActivity from './RecentActivity';
import IncidentTypeChart from './IncidentTypeChart';
import ChartPlaceholder from './ChartPlaceholder';
// 🌟 1. Import the new component
import IncidentsTodayChart from './IncidentsTodayChart';

// 🌟 2. ADD THE MISSING TYPE DEFINITIONS
type IncidentTypeData = {
  incident_type: string;
  count: number;
};

type IncidentStatisticsProps = {
  incidentTypeData: IncidentTypeData[] | undefined;
  incidentsTodayData: number | undefined;
  loading: boolean;
};
// ------------------------------------

const IncidentStatistics = ({
  incidentTypeData,
  incidentsTodayData,
  loading,
}: IncidentStatisticsProps) => { // 3. Now this type is found!

  // Log the data to show we have it
  console.log("Data for 'Incidents Today' chart:", incidentsTodayData);
  console.log("Data for 'Incidents by Type' chart:", incidentTypeData);

  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-4">
        Incident Statistics
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1 */}
        <div className="space-y-8">
          {/* 🌟 2. FIX: This now checks for 'incidentsTodayData' */}
          {loading || typeof incidentsTodayData === 'undefined' ? (
            <ChartPlaceholder title="Incidents Today" />
          ) : (
            // 🌟 3. FIX: Use the new component and pass the 'count' prop
            <IncidentsTodayChart count={incidentsTodayData} />
          )}
        </div>

        {/* Column 2 */}
        <div className="space-y-8">
          {/* This logic correctly checks for data */}
          {loading || !incidentTypeData ? (
            <ChartPlaceholder title="Incidents by Type" />
          ) : (
            <IncidentTypeChart chartData={incidentTypeData} />
          )}
        </div>

        {/* Column 3 */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </section>
  );
};

export default IncidentStatistics;