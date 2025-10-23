import React from 'react';

const ChartPlaceholder = ({ title }: { title: string }) => {
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg h-64 flex flex-col">
      <h4 className="text-md font-semibold text-white mb-4">{title}</h4>
      <div className="flex-grow flex items-center justify-center text-[#6C757D]">
        Chart Placeholder
      </div>
    </div>
  );
};

export default ChartPlaceholder;