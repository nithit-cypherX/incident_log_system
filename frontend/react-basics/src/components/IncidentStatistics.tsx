import React from 'react';
import ChartPlaceholder from './ChartPlaceholder';
import RecentActivity from './RecentActivity';

const IncidentStatistics = () => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-4">Incident Statistics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1 */}
        <div className="space-y-8">
          <ChartPlaceholder title="Incidents Today vs. Average" />
          {/* "Incidents Statuses" chart removed from here */}
        </div>
        
        {/* Column 2 */}
        <div className="space-y-8">
          <ChartPlaceholder title="Incidents by Type (last 7 days)" />
          {/* "Crew Availability Overview" ca   hart removed from here */}
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