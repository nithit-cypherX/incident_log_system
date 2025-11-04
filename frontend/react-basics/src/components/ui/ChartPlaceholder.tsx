// File: src/components/ui/ChartPlaceholder.tsx
/**
 * What it does:
 * A "dumb" component that just shows a gray box with a title.
 * Used when chart data is loading or has failed to load.
 *
 * How it works:
 * - Receives a 'title' prop.
 * - Renders placeholder UI.
 * - No state, no data fetching.
 *
 * How it connects:
 * - Used by 'IncidentStatistics.tsx' in 'features/dashboard'.
 */

type ChartPlaceholderProps = {
  title: string;
};

const ChartPlaceholder = ({ title }: ChartPlaceholderProps) => {
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