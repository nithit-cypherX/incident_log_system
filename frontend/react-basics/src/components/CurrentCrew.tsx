import React from 'react';
import { FaUserEdit, FaUsers } from 'react-icons/fa';

type CrewMember = {
  name: string;
  role: string;
  status: "On Scene" | "En Route" | "Staging";
};

const mockCrew: CrewMember[] = [
  { name: "Ethan Carter", role: "Captain", status: "On Scene" },
  { name: "Olivia Bennett", role: "Firefighter", status: "On Scene" },
  { name: "Noah Thompson", role: "Firefighter", status: "On Scene" },
];

// Small component for the green "On Scene" badge
const StatusBadge = ({ status }: { status: CrewMember['status'] }) => (
  <span className="px-2 py-0.5 bg-green-600 text-white rounded-full text-xs font-medium">
    {status}
  </span>
);

const CurrentCrew = () => {
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg h-full">
      <h3 className="text-xl font-bold text-[#F8F9FA] mb-5">
        Current Crew & Equipment
      </h3>
      
      <div className="space-y-4">
        {/* Header Row */}
        <div className="grid grid-cols-3 gap-4 text-sm font-medium text-[#ADB5BD] border-b border-[#495057] pb-2">
          <span>NAME</span>
          <span>ROLE</span>
          <span>STATUS</span>
        </div>
        
        {/* List of Crew Members */}
        {mockCrew.map((member) => (
          <div key={member.name} className="grid grid-cols-3 gap-4 items-center">
            <span className="text-[#F8F9FA] font-medium">{member.name}</span>
            <span className="text-[#ADB5BD]">{member.role}</span>
            <StatusBadge status={member.status} />
          </div>
        ))}
      </div>

      {/* Buttons at the bottom */}
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