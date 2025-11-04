// File: src/components/ui/MapDisplay.tsx
/**
 * What it does:
 * A "dumb" component that acts as a placeholder for a map.
 *
 * How it works:
 * - It currently accepts no props and just shows static text.
 * - In the future, you could pass it 'lat' and 'lon' props
 * to render a real map (e.g., Google Maps, Mapbox).
 *
 * How it connects:
 * - Used by 'IncidentDetailsPage.tsx'.
 */

// 🌟 You could add props here in the future
// type MapDisplayProps = {
//   lat: number;
//   lon: number;
// };

const MapDisplay = () => {
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg h-96 flex flex-col items-center justify-center text-[#6C757D] border border-[#495057]">
      <span>Map Placeholder</span>
      {/* 🌟 NEW: Show the coordinates to prove it's working! */}
      <span className="text-xs mt-2">
        {/* {lat && lon ? `Coords: ${lat}, ${lon}` : '(No coordinates provided)'} */}
      </span>
    </div>
  );
};

export default MapDisplay;