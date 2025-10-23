import React from 'react';

// Define the props for this component
type BadgeProps = {
  text: string;
  // Define the allowed types for status/priority
  type: 'active' | 'closed' | 'pending' | 'high' | 'medium' | 'low';
};

const StatusBadge = ({ text, type }: BadgeProps) => {
  // An object to map types to their specific Tailwind CSS classes
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

  return (
    // Combine the base classes with the specific color class
    <span className={`${baseClasses} ${colorMap[type]}`}>
      {text}
    </span>
  );
};

export default StatusBadge;