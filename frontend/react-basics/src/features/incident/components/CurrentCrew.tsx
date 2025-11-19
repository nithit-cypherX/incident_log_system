// File: src/features/incident/components/CurrentCrew.tsx
/**
 * What it does:
 * A "dumb" component that displays the list of assigned crew
 * AND assigned equipment.
 *
 * 🌟 --- UPDATED --- 🌟
 * - Removed the "Manage Crew" button to keep this component
 * focused on displaying information, not navigation.
 * - Removed 'useNavigate' hook.
 *
 * How it connects:
 * - 'IncidentDetailsPage.tsx' renders this component and
 * passes the 'assigned_personnel' and 'assigned_equipment' data to it.
 */

import type { Personnel, AssignedEquipment } from "../../../types/common.types";
// 🌟 'useNavigate' is no longer needed

// Define the props for this component
type CrewProps = {
  crew: Personnel[]; // It expects an array of personnel
  equipment: AssignedEquipment[]; // Added
};

const CurrentCrew = ({ crew, equipment }: CrewProps) => {
  // 🌟 'useNavigate' hook removed

  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg h-full">
      <h3 className="text-xl font-bold text-[#F8F9FA] mb-5">
        Current Crew & Equipment
      </h3>

      {/* --- Assigned Personnel Section --- */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-primary-color mb-2">
          Assigned Personnel
        </h4>
        {/* Header Row */}
        <div className="grid grid-cols-2 gap-4 text-sm font-medium text-[#ADB5BD] border-b border-[#495057] pb-2">
          <span>NAME</span>
          <span>ROLE</span>
        </div>

        {/* List of Crew Members from props */}
        {crew.length > 0 ? (
          crew.map((member) => (
            <div key={member.user_id} className="grid grid-cols-2 gap-4 items-center">
              <span className="text-[#F8F9FA] font-medium">{member.user_name}</span>
              <span className="text-[#ADB5BD]">{member.role_on_incident}</span>
            </div>
          ))
        ) : (
          <p className="text-[#ADB5BD] text-sm text-center py-4">
            No personnel assigned to this incident.
          </p>
        )}
      </div>

      {/* --- Assigned Equipment Section --- */}
      <div className="space-y-4 mt-8">
        <h4 className="text-sm font-semibold text-primary-color mb-2">
          Assigned Equipment
        </h4>
        {/* Header Row */}
        <div className="grid grid-cols-2 gap-4 text-sm font-medium text-[#ADB5BD] border-b border-[#495057] pb-2">
          <span>ASSET ID</span>
          <span>TYPE</span>
        </div>

        {/* List of Equipment from props */}
        {equipment.length > 0 ? (
          equipment.map((item) => (
            <div key={item.id} className="grid grid-cols-2 gap-4 items-center">
              <span className="text-[#F8F9FA] font-medium">{item.asset_id}</span>
              <span className="text-[#ADB5BD]">{item.type}</span>
            </div>
          ))
        ) : (
          <p className="text-[#ADB5BD] text-sm text-center py-4">
            No equipment assigned to this incident.
          </p>
        )}
      </div>
      
      {/* 🌟 --- Button section removed --- 🌟 */}
    </div>
  );
};

export default CurrentCrew;