
// 1. Import the chart components
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// 2. Register the parts of the chart we need
ChartJS.register(ArcElement, Tooltip, Legend);

// 3. Define the data types we expect
type IncidentTypeData = {
  incident_type: string;
  count: number;
};

type Props = {
  chartData: IncidentTypeData[];
};

// 4. Helper function to format data for the chart
const formatDataForChart = (data: IncidentTypeData[]) => {
  const labels = data.map(item => item.incident_type.toUpperCase());
  const counts = data.map(item => item.count);

  return {
    labels: labels,
    datasets: [
      {
        label: '# of Incidents',
        data: counts,
        backgroundColor: [
          '#DC3545', // Red (fire)
          '#0D6EFD', // Blue (ems)
          '#FFC107', // Yellow (rescue)
          '#20C997', // Teal (hazmat)
          '#6C757D', // Gray (public_assist)
          '#F8F9FA', // White (other)
        ],
        borderColor: '#2C3034', // Chart background color
        borderWidth: 2,
      },
    ],
  };
};

const IncidentTypeChart = ({ chartData }: Props) => {
  // 5. Format the data
  const data = formatDataForChart(chartData);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to fill container
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#F8F9FA' // Legend text color
        }
      },
      title: {
        display: true,
        text: 'Incidents by Type',
        color: '#F8F9FA' // Title text color
      },
    },
  };

  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg h-64 flex flex-col">
      {/* 6. Render the Doughnut chart! */}
      <div className="relative flex-grow">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default IncidentTypeChart;