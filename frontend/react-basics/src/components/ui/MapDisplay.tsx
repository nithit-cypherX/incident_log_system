// File: src/components/ui/MapDisplay.tsx
/**
 * What it does:
 * A "dumb" component that renders a Leaflet map.
 *
 * How it works:
 * - It's no longer a placeholder!
 * - It uses 'react-leaflet' components (<MapContainer>, <TileLayer>, <Marker>).
 * - It receives 'lat' and 'lon' as props.
 * - It displays a 'error' or 'loading' state if no coords are provided.
 * - 'MapWrapper' is a helper to handle map resizing and view changes.
 *
 * How it connects:
 * - Used by 'IncidentDetailsPage.tsx' and 'IncidentFormPage.tsx'.
 */

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useEffect } from "react";
import { FaMapMarkerAlt, FaExclamationTriangle } from "react-icons/fa";

// --- Props ---
type MapDisplayProps = {
  lat?: number | null;
  lon?: number | null;
  error?: string | null;
  isInteractive?: boolean; // Is the map for a form (true) or details (false)
};

// --- Helper Component ---
/**
 * This helper component is necessary to dynamically update
 * the map's center and zoom when the props change.
 */
const MapWrapper = ({
  center,
  zoom,
}: {
  center: LatLngExpression;
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// --- Main Component ---
const MapDisplay = ({ lat, lon, error, isInteractive = false }: MapDisplayProps) => {
  const position: LatLngExpression | null =
    lat && lon ? [lat, lon] : null;

  // Set a default view (Bangkok)
  const defaultCenter: LatLngExpression = [13.7563, 100.5018];

  const renderContent = () => {
    // 1. Show an error
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400">
          <FaExclamationTriangle size={30} className="mb-2" />
          <span className="font-semibold">Error finding address</span>
          <span className="text-sm">{error}</span>
        </div>
      );
    }

    // 2. Show the map
    if (position) {
      return (
        <MapContainer
          center={position}
          zoom={16} // Zoom in close for a specific address
          scrollWheelZoom={isInteractive} // Only allow zoom on form page
          className="h-full w-full"
          dragging={isInteractive} // Only allow dragging on form page
          touchZoom={isInteractive}
          doubleClickZoom={isInteractive}
        >
          <MapWrapper center={position} zoom={16} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon-opacity={1}>
            {/* We don't need a <Popup> for this app */}
          </Marker>
        </MapContainer>
      );
    }

    // 3. Show a placeholder (loading or no address)
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#6C757D]">
        <FaMapMarkerAlt size={30} className="mb-2" />
        <span className="font-semibold">
          {isInteractive
            ? "Type an address to find location"
            : "No coordinates for this incident"}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-[#2C3034] p-2 rounded-lg shadow-lg h-96 border border-[#495057] overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default MapDisplay;