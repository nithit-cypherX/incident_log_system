// File: src/components/ui/StatusBadge.tsx
/**
 * What it does:
 * A "dumb" presentational component (Guide Part 2).
 * It displays a colored badge based on a 'type' prop.
 *
 * How it works:
 * - Receives 'text' and 'type' as props.
 * - Uses a 'colorMap' to select the correct Tailwind classes.
 * - It has no state and fetches no data.
 *
 * How it connects:
 * - Imported by 'IncidentOverview.tsx' and 'IncidentList.tsx'.
 */

// Define the props it accepts
type BadgeProps = {
  text: string;
  type:
    | "active"
    | "closed"
    | "pending"
    | "high"
    | "medium"
    | "low"
    | "fire"
    | "ems"
    | "rescue"
    | "hazmat"
    | "public_assist"
    | "other";
};

const StatusBadge = ({ text, type }: BadgeProps) => {
  // Color map for all possible types
  const colorMap = {
    // Status
    active: "bg-[#DC3545] text-white",
    closed: "bg-[#28A745] text-white",
    pending: "bg-[#FFC107] text-black",
    // Priority
    high: "bg-red-700 text-white",
    medium: "bg-yellow-600 text-black",
    low: "bg-gray-500 text-white",
    // Incident Type
    fire: "bg-red-500 text-white",
    ems: "bg-blue-500 text-white",
    rescue: "bg-yellow-500 text-black",
    hazmat: "bg-green-500 text-white",
    public_assist: "bg-cyan-500 text-white",
    other: "bg-gray-400 text-black",
  };

  // Base classes for all badges
  const baseClasses = "py-1 px-3 rounded-full text-xs font-semibold";

  // Handle a type that might not be in the map
  const colorClasses = colorMap[type] || "bg-gray-500 text-white";

  return (
    // Combine the base classes with the specific color class
    <span className={`${baseClasses} ${colorClasses}`}>
      {text}
    </span>
  );
};

export default StatusBadge;