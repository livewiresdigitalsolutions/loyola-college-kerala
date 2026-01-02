// "use client";

// import { useEffect, useState } from "react";
// import StatsCard from "../components/StatsCard";
// import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";
// import { toast } from "react-hot-toast";

// export default function Dashboard() {
//   const [stats, setStats] = useState({
//     total: 0,
//     submitted: 0,
//     draft: 0,
//     pending: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const response = await fetch("/api/sys-ops/stats");
//       if (response.ok) {
//         const data = await response.json();
//         setStats(data);
//       }
//     } catch (error) {
//       toast.error("Failed to load statistics");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//         <p className="text-gray-600 mt-1">
//           Overview of admission applications
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Total Applications"
//           value={stats.total}
//           icon={FileText}
//           color="bg-blue-500"
//         />
//         <StatsCard
//           title="Submitted"
//           value={stats.submitted}
//           icon={CheckCircle}
//           color="bg-green-500"
//         />
//         <StatsCard
//           title="Draft"
//           value={stats.draft}
//           icon={Clock}
//           color="bg-yellow-500"
//         />
//         <StatsCard
//           title="Payment Pending"
//           value={stats.pending}
//           icon={XCircle}
//           color="bg-red-500"
//         />
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">
//           Recent Activity
//         </h2>
//         <p className="text-gray-500 text-center py-8">
//           Activity timeline coming soon...
//         </p>
//       </div>
//     </div>
//   );
// }










// app/sys-ops/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";
import StatsCard from "@/app/sys-ops/components/StatsCard";
import ProgramChart from "@/app/sys-ops/components/charts/ProgramChart";
import GenderChart from "@/app/sys-ops/components/charts/GenderChart";
import CategoryChart from "@/app/sys-ops/components/charts/CategoryChart";
import CityChart from "@/app/sys-ops/components/charts/CityChart";
import TimelineChart from "@/app/sys-ops/components/charts/TimelineChart";

interface BasicStats {
  total: number;
  submitted: number;
  draft: number;
  pending: number;
}

interface ChartData {
  programStats: Array<{ program_name: string; count: number }>;
  genderStats: Array<{ gender: string; count: number }>;
  categoryStats: Array<{ category: string; count: number }>;
  cityStats: Array<{ city: string; state: string; count: number }>;
  timelineStats: Array<{ date: string; count: number }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<BasicStats>({
    total: 0,
    submitted: 0,
    draft: 0,
    pending: 0,
  });
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/sys-ops/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        toast.error("Failed to load statistics");
      }
    } catch (error) {
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch("/api/sys-ops/dashboard-stats");
      if (response.ok) {
        const data = await response.json();
        setChartData(data);
      }
    } catch (error) {
      console.error("Failed to load chart data:", error);
    } finally {
      setChartsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#342D87] mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive overview of admission applications
          </p>
        </div>
        <button
          onClick={() => {
            fetchStats();
            fetchChartData();
          }}
          className="px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={stats.total}
          icon={FileText}
          color="bg-blue-500"
          change="+12% from last month"
          changeType="increase"
        />
        <StatsCard
          title="Submitted"
          value={stats.submitted}
          icon={CheckCircle}
          color="bg-green-500"
          change="Payment completed"
          changeType="increase"
        />
        <StatsCard
          title="Draft"
          value={stats.draft}
          icon={Clock}
          color="bg-yellow-500"
          change="In progress"
        />
        <StatsCard
          title="Payment Pending"
          value={stats.pending}
          icon={XCircle}
          color="bg-red-500"
          change="Awaiting payment"
        />
      </div>

      {/* Charts Section */}
      {chartsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div>
        </div>
      ) : chartData ? (
        <>
          {/* Timeline */}
          {chartData.timelineStats.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-[#342D87]" />
                <h2 className="text-xl font-bold text-gray-900">
                  Applications Timeline (Last 30 Days)
                </h2>
              </div>
              <TimelineChart data={chartData.timelineStats} />
            </div>
          )}

          {/* Programs and Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {chartData.programStats.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-[#342D87]" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Applications by Program
                  </h2>
                </div>
                <ProgramChart data={chartData.programStats} />
              </div>
            )}

            {chartData.genderStats.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-[#342D87]" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Gender Distribution
                  </h2>
                </div>
                <GenderChart data={chartData.genderStats} />
              </div>
            )}

            {chartData.categoryStats.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-[#342D87]" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Category Distribution
                  </h2>
                </div>
                <CategoryChart data={chartData.categoryStats} />
              </div>
            )}

            {chartData.cityStats.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-[#342D87]" />
                  <h2 className="text-xl font-bold text-gray-900">Top 10 Cities</h2>
                </div>
                <CityChart data={chartData.cityStats} />
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
