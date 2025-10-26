import React from 'react';
import { FaUserEdit, FaUsers } from 'react-icons/fa';

// 🌟 NEW: Define the shape of the personnel data we expect from the API
type Personnel = {
  user_id: number;
  user_name: string;
  role_on_incident: string;
};

// 🌟 NEW: Define the props for this component
type CrewProps = {
  crew: Personnel[]; // It expects an array of personnel
};

// 🌟 REMOVED: mockCrew array

// 🌟 REMOVED: Internal StatusBadge component (no longer needed)

const CurrentCrew = ({ crew }: CrewProps) => { // 🌟 UPDATED: Accept 'crew' prop
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg h-full">
      <h3 className="text-xl font-bold text-[#F8F9FA] mb-5">
        Current Crew & Equipment
      </h3>
      
      <div className="space-y-4">
        {/* 🌟 UPDATED: Header Row (removed Status) */}
        <div className="grid grid-cols-2 gap-4 text-sm font-medium text-[#ADB5BD] border-b border-[#495057] pb-2">
          <span>NAME</span>
          <span>ROLE</span>
        </div>
        
        {/* 🌟 UPDATED: List of Crew Members from props */}
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

      {/* Buttons at the bottom (no change) */}
      <div className="flex gap-4 mt-6 pt-6 border-t border-[#495057]">
        <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center">
          <FaUserEdit className="mr-2" /> Edit Incident
        </button>
        <button className="flex-1 bg-[#0D6EFD] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center">
          <FaUsers className="mr-2" /> Manage Crew
        </button>
      </div>
    </div>
  );
};

export default CurrentCrew;