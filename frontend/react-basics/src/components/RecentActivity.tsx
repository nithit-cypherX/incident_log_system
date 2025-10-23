import React from 'react';
import { FaFire, FaCheckCircle, FaBell } from 'react-icons/fa';

const activities = [
  { 
    icon: <FaFire className="text-red-500" />, 
    text: "Incident #1234 reported in Downtown (mins ago)" 
  },
  { 
    icon: <FaCheckCircle className="text-green-500" />, 
    text: "Incident #1230 resolved by Alpha Crew (3 hours ago)" 
  },
  { 
    icon: <FaBell className="text-yellow-500" />, 
    text: "New alert: Equipment maintenance due" 
  },
];

const RecentActivity = () => {
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg h-64">
      <h4 className="text-md font-semibold text-white mb-4">Recent Activity & Updates</h4>
      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <li key={index} className="flex items-center gap-3">
            <span className="flex-shrink-0">{activity.icon}</span>
            <span className="text-sm text-[#ADB5BD]">{activity.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;