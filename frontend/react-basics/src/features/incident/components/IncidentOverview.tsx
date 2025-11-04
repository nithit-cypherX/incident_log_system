// File: src/features/incident/components/IncidentOverview.tsx
/**
 * What it does:
 * A "dumb" component that displays the main details of an incident.
 *
 * How it works:
 * - Receives all incident data (type, location, status, etc.) as props.
 * - Renders the data in a grid.
 * - Uses the 'StatusBadge' UI component.
 *
 * How it connects:
 * - 'IncidentDetailsPage.tsx' renders this component.
 */

import StatusBadge from "../../../components/ui/StatusBadge";
import type { IncidentPriority, IncidentStatus, IncidentType } from "../../../types/common.types";

// --- Helper Components (now live inside this file) ---
type DetailItemProps = {
  label: string;
  value: React.ReactNode;
  className?: string; // Allow custom styling (for description)
};
const DetailItem = ({ label, value, className = "" }: DetailItemProps) => (
  <div className={className}>
    <dt className="text-sm font-medium text-[#ADB5BD]">{label}</dt>
    <dd className="mt-1 text-lg text-[#F8F9FA]">{value}</dd>
  </div>
);

// --- Component Props ---
type IncidentOverviewProps = {
  incidentType: IncidentType;
  location: string;
  reportedAt: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  description: string;
};

// --- Main Component ---
const IncidentOverview = ({
  incidentType,
  location,
  reportedAt,
  status,
  priority,
  description,
}: IncidentOverviewProps) => {
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-[#F8F9FA] mb-6">Incident Overview</h3>

      <dl className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-8">
        <DetailItem
          label="Incident Type"
          value={incidentType.charAt(0).toUpperCase() + incidentType.slice(1)}
        />
        <DetailItem label="Location" value={location} />
        <DetailItem label="Reported At" value={reportedAt} />
        <DetailItem
          label="Status"
          value={
            <StatusBadge
              text={status.charAt(0).toUpperCase() + status.slice(1)}
              type={status}
            />
          }
        />

        <DetailItem
          label="Priority"
          value={
            <StatusBadge
              text={priority.charAt(0).toUpperCase() + priority.slice(1)}
              type={priority}
            />
          }
        />

        <DetailItem
          label="Description"
          value={
            <p className="text-base text-[#F8F9FA]">{description || "N/A"}</p>
          }
          className="md:col-span-3"
        />
      </dl>
    </div>
  );
};

export default IncidentOverview;