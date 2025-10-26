import React from 'react';
import StatusBadge from './StatusBadge'; // 🌟 IMPORT the shared badge

// --- Helper Components (now live inside this file) ---
type DetailItemProps = {
  label: string;
  value: React.ReactNode;
  className?: string; // Allow custom styling (for description)
};
const DetailItem = ({ label, value, className = '' }: DetailItemProps) => (
  <div className={className}>
    <dt className="text-sm font-medium text-[#ADB5BD]">{label}</dt>
    <dd className="mt-1 text-lg text-[#F8F9FA]">{value}</dd>
  </div>
);

// --- 🌟 UPDATED: Component Props ---
type IncidentOverviewProps = {
  incidentType: string;
  location: string;
  reportedAt: string;
  // 💡 FIXED: 'other' removed from status
  status: 'active' | 'pending' | 'closed';
  priority: 'high' | 'medium' | 'low'; // Match DB
  description: string;
};

// --- Main Component ---
const IncidentOverview = ({
  incidentType,
  location,
  reportedAt,
  status,
  priority,
  description
}: IncidentOverviewProps) => {
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-[#F8F9FA] mb-6">Incident Overview</h3>
      
      {/* 🌟 UPDATED: Grid now includes Priority */}
      <dl className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-8">
        <DetailItem
          label="Incident Type"
          value={incidentType.charAt(0).toUpperCase() + incidentType.slice(1)}
        />
        <DetailItem label="Location" value={location} />
        <DetailItem label="Reported At" value={reportedAt} />
        <DetailItem 
          label="Status" 
          value={<StatusBadge
            text={status.charAt(0).toUpperCase() + status.slice(1)}
            type={status}
          />} 
        />
        
        {/* 🌟 NEW: Added Priority */}
        <DetailItem 
          label="Priority" 
          value={<StatusBadge
            text={priority.charAt(0).toUpperCase() + priority.slice(1)}
            type={priority}
          />} 
        />
        
        {/* 🌟 NEW: Added Description, spanning 3 columns */}
        <DetailItem 
          label="Description" 
          value={<p className="text-base text-[#F8F9FA]">{description || 'N/A'}</p>}
          className="md:col-span-3"
        />
      </dl>
    </div>
  );
};

export default IncidentOverview;