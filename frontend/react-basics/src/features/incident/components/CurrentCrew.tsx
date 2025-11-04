// File: src/features/incident/components/CurrentCrew.tsx
/**
 * What it does:
 * A "dumb" component that displays the list of assigned crew.
 *
 * How it works:
 * - Receives a 'crew' array as a prop.
 * - Maps over the array and renders the list.
 *
 * How it connects:
 * - 'IncidentDetailsPage.tsx' renders this component and
 * passes the 'assigned_personnel' data to it.
 */

import { FaUsers } from "react-icons/fa";
import type { Personnel } from "../../../types/common.types";

// Define the props for this component
type CrewProps = {
  crew: Personnel[]; // It expects an array of personnel
};

const CurrentCrew = ({ crew }: CrewProps) => {
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg h-full">
      <h3 className="text-xl font-bold text-[#F8F9FA] mb-5">
        Current Crew & Equipment
      </h3>

      <div className="space-y-4">
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

      {/* Buttons at the bottom */}
      <div className="flex gap-4 mt-6 pt-6 border-t border-[#495057]">
        <button className="flex-1 bg-[#0D6EFD] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center">
          <FaUsers className="mr-2" /> Manage Crew
        </button>
      </div>
    </div>
  );
};

export default CurrentCrew;