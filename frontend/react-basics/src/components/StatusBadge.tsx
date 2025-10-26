// import React from 'react';

// 💡 FIXED: 'other' removed from type
type BadgeProps = {
  text: string;
  type: 'active' | 'closed' | 'pending' | 'high' | 'medium' | 'low';
};

const StatusBadge = ({ text, type }: BadgeProps) => {
  // 💡 FIXED: 'other' removed from colorMap
  const colorMap = {
    active: 'bg-[#DC3545] text-white',
    closed: 'bg-[#28A745] text-white',
    pending: 'bg-[#FFC107] text-black',
    high: 'bg-red-700 text-white',
    medium: 'bg-yellow-600 text-black',
    low: 'bg-gray-500 text-white',
  };

  // Base classes for all badges
  const baseClasses = "py-1 px-3 rounded-full text-xs font-semibold";

  // Handle a type that might not be in the map
  const colorClasses = colorMap[type] || 'bg-gray-500 text-white';

  return (
    // Combine the base classes with the specific color class
    <span className={`${baseClasses} ${colorClasses}`}>
      {text}
    </span>
  );
};

export default StatusBadge;