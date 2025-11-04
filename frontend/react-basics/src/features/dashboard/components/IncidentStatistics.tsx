// File: src/features/dashboard/components/IncidentStatistics.tsx
/**
 * What it does:
 * A "dumb" layout component that arranges the charts.
 *
 * How it works:
 * - It receives data and loading state as props.
 * - It passes the data down to the specific chart components.
 * - It shows 'ChartPlaceholder' if data is loading.
 *
 * How it connects:
 * - Rendered by 'DashboardPage.tsx'.
 */

import RecentActivity from "./RecentActivity";
import IncidentTypeChart from "./IncidentTypeChart";
import ChartPlaceholder from "../../../components/ui/ChartPlaceholder";
import IncidentsTodayChart from "./IncidentsTodayChart";
import type { IncidentTypeData } from "../types/dashboard.types";

type IncidentStatisticsProps = {
  incidentTypeData: IncidentTypeData[] | undefined;
  incidentsTodayData: number | undefined;
  loading: boolean;
};

const IncidentStatistics = ({
  incidentTypeData,
  incidentsTodayData,
  loading,
}: IncidentStatisticsProps) => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-4">
        Incident Statistics
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1 */}
        <div className="space-y-8">
          {loading || typeof incidentsTodayData === "undefined" ? (
            <ChartPlaceholder title="Incidents Today" />
          ) : (
            <IncidentsTodayChart count={incidentsTodayData} />
          )}
        </div>

        {/* Column 2 */}
        <div className="space-y-8">
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