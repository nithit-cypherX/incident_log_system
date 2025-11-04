// File: src/features/dashboard/components/IncidentsTodayChart.tsx
/**
 * What it does:
 * A "dumb" component that displays the 'Incidents Today' count.
 *
 * How it works:
 * - Receives a 'count' prop and displays it.
 *
 * How it connects:
 * - Rendered by 'IncidentStatistics.tsx'.
 */

type Props = {
  count: number;
};

const IncidentsTodayChart = ({ count }: Props) => {
  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg h-64 flex flex-col items-center justify-center">
      <h4 className="text-md font-semibold text-white mb-4">
        Incidents Today
      </h4>
      <div className="flex-grow flex items-center justify-center">
        <span className="text-7xl font-bold text-[#F8F9FA]">
          {count}
        </span>
      </div>
    </div>
  );
};

export default IncidentsTodayChart;