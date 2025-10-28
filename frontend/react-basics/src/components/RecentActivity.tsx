import React, { useState, useEffect } from 'react';
import { FaFire, FaCheckCircle, FaBell, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

// 🌟 1. Define the type for the API data
type Activity = {
  id: number;
  incident_code: string;
  title: string;
  status: 'active' | 'pending' | 'closed';
  updated_at: string;
};

// 🌟 2. Helper function to format time
// (This is simple, you can use a library like 'date-fns' for "3 hours ago")
const formatTime = (isoString: string) => {
   try {
     const date = new Date(isoString);
     return date.toLocaleString(); // e.g., "10/28/2025, 3:30:00 PM"
   } catch (e) {
     return "Invalid date"
   }
}

// 🌟 3. Helper to get icon based on status
const getIcon = (status: 'active' | 'pending' | 'closed') => {
  switch(status) {
    case 'active':
      return <FaFire className="text-red-500" />;
    case 'pending':
      return <FaBell className="text-yellow-500" />;
    case 'closed':
      return <FaCheckCircle className="text-green-500" />;
    default:
      return <FaBell className="text-gray-500" />;
  }
};

const RecentActivity = () => {
  // 🌟 4. Add state for activities, loading, and error
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🌟 5. Fetch data on component load
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/incidents/recent-activity", {
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error("Failed to fetch recent activity");
        }
        const data: Activity[] = await response.json();
        setActivities(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentActivity();
  }, []);


  return (
    <div className="bg-[#2C3034] p-6 rounded-lg shadow-lg h-64">
      <h4 className="text-md font-semibold text-white mb-4">Recent Activity & Updates</h4>
      
      {/* 🌟 6. Handle loading and error states */}
      {loading && (
        <div className="flex items-center justify-center h-full text-secondary-color">
          <FaSpinner className="animate-spin mr-2" /> Loading...
        </div>
      )}
      
      {error && (
         <div className="flex flex-col items-center justify-center h-full text-red-400">
          <FaExclamationTriangle className="mb-2" />
          <span className="text-sm">Failed to load activity</span>
        </div>
      )}

      {/* 🌟 7. Render real data */}
      {!loading && !error && (
        <ul className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <li key={activity.id} className="flex items-center gap-3">
                <span className="flex-shrink-0">{getIcon(activity.status)}</span>
                <span className="text-sm text-[#ADB5BD]">
                  {/* Create a useful message from the data */}
                  <strong>{activity.incident_code}</strong> ({activity.status})
                  <span className="block text-xs">{formatTime(activity.updated_at)}</span>
                </span>
              </li>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-secondary-color">
              No recent activity.
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;