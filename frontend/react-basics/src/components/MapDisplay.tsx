import React from 'react';

// 🌟 NEW: Define a type for the props this component will receive
type MapDisplayProps = {
  lat: number;
  lon: number;
};

// 🌟 UPDATED: Use the new type and accept the 'lat' and 'lon' props
const MapDisplay = ({ lat, lon }: MapDisplayProps) => {
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg h-96 flex flex-col items-center justify-center text-[#6C757D] border border-[#495057]">
      <span>Map Placeholder</span>
      {/* 🌟 NEW: Show the coordinates to prove it's working! */}
      <span className="text-xs mt-2">
        Coordinates: {lat}, {lon}
      </span>
    </div>
  );
};

export default MapDisplay;