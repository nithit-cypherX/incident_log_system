import React from 'react';

// --- Helper Components (now live inside this file) ---
type DetailItemProps = {
  label: string;
  value: React.ReactNode;
};
const DetailItem = ({ label, value }: DetailItemProps) => (
  <div>
    <dt className="text-sm font-medium text-[#ADB5BD]">{label}</dt>
    <dd className="mt-1 text-lg text-[#F8F9FA]">{value}</dd>
  </div>
);

type Status = "Active" | "Pending" | "Closed";
const StatusBadge = ({ status }: { status: Status }) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-medium ${
    status === 'Active' ? 'bg-green-600 text-white' :
    status === 'Closed' ? 'bg-gray-600 text-white' :
    'bg-yellow-500 text-black'
  }`}>
    {status}
  </span>
);

// --- Component Props ---
// Define the data this component expects to receive
type IncidentOverviewProps = {
  incidentType: string;
  location: string;
  reportedAt: string;
  status: Status;
};

// --- Main Component ---
const IncidentOverview = ({ incidentType, location, reportedAt, status }: IncidentOverviewProps) => {
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-[#F8F9FA] mb-6">Incident Overview</h3>
      
      <dl className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-8">
        <DetailItem label="Incident Type" value={incidentType} />
        <DetailItem label="Location" value={location} />
        <DetailItem label="Reported At" value={reportedAt} />
        <DetailItem 
          label="Status" 
          value={<StatusBadge status={status} />} 
        />
      </dl>
    </div>
  );
};

export default IncidentOverview;