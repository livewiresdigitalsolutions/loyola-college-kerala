"use client";

import { useEffect, useState } from "react";
import StatsCard from "../components/StatsCard";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    draft: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/sys-ops/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of admission applications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={stats.total}
          icon={FileText}
          color="bg-blue-500"
        />
        <StatsCard
          title="Submitted"
          value={stats.submitted}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatsCard
          title="Draft"
          value={stats.draft}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          color="bg-red-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-500 text-center py-8">
          Activity timeline coming soon...
        </p>
      </div>
    </div>
  );
}
