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
  Award,
  TrendingUp,
  Target,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAcademicYearConfig } from "@/app/lib/academicYearConfig"; // Import the hook
import { YearPicker } from "@/app/sys-ops/components/YearPicker";
import StatsCard from "@/app/sys-ops/components/StatsCard";
import ProgramChart from "@/app/sys-ops/components/charts/ProgramChart";
import GenderChart from "@/app/sys-ops/components/charts/GenderChart";
import CategoryChart from "@/app/sys-ops/components/charts/CategoryChart";
import CityChart from "@/app/sys-ops/components/charts/CityChart";
import TimelineChart from "@/app/sys-ops/components/charts/TimelineChart";
import GaugeChart from "@/app/sys-ops/components/charts/GaugeChart";

interface DashboardData {
  overview: {
    total: number;
    submitted: number;
    draft: number;
    pending: number;
  };
  programStats: Array<{ program_name: string; count: number }>;
  courseStats: Array<{ course_name: string; degree_name: string; count: number }>;
  demographics: {
    gender: Array<{ gender: string; count: number }>;
    category: Array<{ category: string; count: number }>;
    nationality: Array<{ nationality: string; count: number }>;
  };
  geography: {
    cities: Array<{ city: string; state: string; count: number }>;
    states: Array<{ state: string; count: number }>;
  };
  timeline: Array<{ date: string; count: number }>;
  recentApplications: Array<any>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Get the current academic year start from config
  const academicYearConfig = getAcademicYearConfig();
  const defaultYear = academicYearConfig.start.toString();

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchDashboardData();
    }
  }, [selectedYear]);

  const fetchAvailableYears = async () => {
    try {
      const response = await fetch("/api/sys-ops/available-years");
      if (response.ok) {
        const years = await response.json();
        setAvailableYears(years);
        
        // Set initial year to academicYearConfig.start
        setSelectedYear(defaultYear);
      } else {
        toast.error("Failed to load available years");
      }
    } catch (error) {
      console.error("Error fetching years:", error);
      toast.error("Failed to load available years");
    }
  };

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/sys-ops/dashboard-stats?year=${selectedYear}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log("=== FULL API RESPONSE ===", result);
        
        const normalizedData: DashboardData = {
          overview: result.overview || {
            total: 0,
            submitted: 0,
            draft: 0,
            pending: 0,
          },
          programStats: result.programStats || [],
          courseStats: result.courseStats || [],
          demographics: {
            gender: result.demographics?.gender || [],
            category: result.demographics?.category || [],
            nationality: result.demographics?.nationality || [],
          },
          geography: {
            cities: result.geography?.cities || [],
            states: result.geography?.states || [],
          },
          timeline: result.timeline || [],
          recentApplications: result.recentApplications || [],
        };
        
        setData(normalizedData);
      } else {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No data available</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const completionRate = data.overview.total > 0
    ? Math.round((data.overview.submitted / data.overview.total) * 100)
    : 0;

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
        
        <div className="flex items-center gap-3">
          <YearPicker
            value={selectedYear}
            onChange={setSelectedYear}
            availableYears={availableYears}
          />

          {/* Refresh Button */}
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
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
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={data.overview.total}
          icon={FileText}
          color="bg-blue-500"
        />
        <StatsCard
          title="Submitted"
          value={data.overview.submitted}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatsCard
          title="Draft"
          value={data.overview.draft}
          icon={Clock}
        />
        <StatsCard
          title="Payment Pending"
          value={data.overview.pending}
          icon={XCircle}
          color="bg-red-500"
        />
      </div>

      {/* Gauge Charts */}
      {data.overview.total > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-[#342D87]" />
            <h2 className="text-xl font-bold text-gray-900">Performance Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GaugeChart
              value={data.overview.submitted}
              max={data.overview.total}
              label="Submitted Applications"
              color="#10b981"
            />
            <GaugeChart
              value={completionRate}
              max={100}
              label="Completion Rate"
              color="#3b82f6"
            />
            <GaugeChart
              value={data.overview.total - data.overview.pending}
              max={data.overview.total}
              label="Processed Applications"
              color="#8b5cf6"
            />
          </div>
        </div>
      )}

      {/* Timeline Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#342D87]" />
          <h2 className="text-xl font-bold text-gray-900">
            Applications Timeline (Last 30 Days)
          </h2>
        </div>
        <TimelineChart data={data.timeline || []} />
      </div>

      {/* Programs and Gender */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#342D87]" />
            <h2 className="text-xl font-bold text-gray-900">
              Applications by Program
            </h2>
          </div>
          <ProgramChart data={data.programStats || []} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#342D87]" />
            <h2 className="text-xl font-bold text-gray-900">
              Gender Distribution
            </h2>
          </div>
          <GenderChart data={data.demographics?.gender || []} />
        </div>
      </div>

      {/* Category and Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#342D87]" />
            <h2 className="text-xl font-bold text-gray-900">
              Category Distribution
            </h2>
          </div>
          <CategoryChart data={data.demographics?.category || []} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-[#342D87]" />
            <h2 className="text-xl font-bold text-gray-900">Top 10 Cities</h2>
          </div>
          <CityChart data={data.geography?.cities || []} />
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[#342D87]" />
          <h2 className="text-xl font-bold text-gray-900">
            Recent Applications
          </h2>
        </div>
        {data.recentApplications && data.recentApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Applicant
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Program
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Course
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentApplications.map((app, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{app.full_name}</p>
                        <p className="text-sm text-gray-600">{app.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {app.program}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {app.course}
                    </td>
                    <td className="py-3 px-4">
                      {app.payment_status === "completed" ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Submitted
                        </span>
                      ) : app.payment_status === "pending" ? (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                          Payment Pending
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No recent applications</p>
        )}
      </div>
    </div>
  );
}
