// File: src/features/dashboard/components/StatCard.tsx
/**
 * What it does:
 * A "dumb" component that displays a single statistic.
 *
 * How it works:
 * - It's unchanged from your original file.
 * - It receives props for 'title', 'value', 'isLoading', etc.
 * - It renders the correct UI for loading/error/data states.
 *
 * How it connects:
 * - 'DashboardPage.tsx' renders this component multiple times.
 */

import { FaExclamationTriangle, FaSpinner } from "react-icons/fa";

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  valueColor?: string;
  isLoading: boolean; // 1. Add isLoading prop
  hasError: boolean; // 2. Add hasError prop
};

const StatCard = ({
  title,
  value,
  description,
  valueColor = "text-white",
  isLoading,
  hasError,
}: StatCardProps) => {
  // 3. Add logic to render the correct content inside the card
  const renderValue = () => {
    if (isLoading) {
      // Use text-5xl to make it large like the number
      return <FaSpinner className="animate-spin text-5xl mt-2" />;
    }
    if (hasError) {
      return (
        <FaExclamationTriangle className="text-5xl mt-2 text-red-500" />
      );
    }
    // If not loading and no error, show the value
    return (
      <p className={`text-6xl font-bold mt-2 ${valueColor}`}>{value}</p>
    );
  };

  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg">
      <h3 className="text-sm font-medium text-[#ADB5BD] uppercase">
        {title}
      </h3>
      {renderValue()} {/* 4. Call the render function */}
      <p className="text-[#ADB5BD] mt-2">{description}</p>
    </div>
  );
};

export default StatCard;