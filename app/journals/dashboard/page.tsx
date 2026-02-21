"use client";

import React, { useEffect, useState } from "react";
import { useJournalAuth } from "../_components/AuthContext";
import { FileText, Send, CheckCircle2, Clock, FilePen } from "lucide-react";
import Link from "next/link";

interface ArticleStats {
  total: number;
  drafts: number;
  submitted: number;
  approved: number;
  rejected: number;
}

export default function DashboardOverview() {
  const { user } = useJournalAuth();
  const [stats, setStats] = useState<ArticleStats>({
    total: 0, drafts: 0, submitted: 0, approved: 0, rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journals/articles")
      .then((res) => res.json())
      .then((articles) => {
        if (Array.isArray(articles)) {
          setStats({
            total: articles.length,
            drafts: articles.filter((a: any) => a.status === "draft").length,
            submitted: articles.filter((a: any) => a.status === "submitted" || a.status === "under_review").length,
            approved: articles.filter((a: any) => a.status === "approved").length,
            rejected: articles.filter((a: any) => a.status === "rejected").length,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Articles", value: stats.total, icon: FileText, color: "bg-blue-500", bg: "bg-blue-50" },
    { label: "Drafts", value: stats.drafts, icon: FilePen, color: "bg-gray-500", bg: "bg-gray-50" },
    { label: "Under Review", value: stats.submitted, icon: Clock, color: "bg-amber-500", bg: "bg-amber-50" },
    { label: "Published", value: stats.approved, icon: CheckCircle2, color: "bg-green-500", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome, {user?.first_name}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your journal article submissions from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon size={20} className={`text-${card.color.replace('bg-', '')}`} style={{ color: card.color === 'bg-blue-500' ? '#3b82f6' : card.color === 'bg-gray-500' ? '#6b7280' : card.color === 'bg-amber-500' ? '#f59e0b' : '#22c55e' }} />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {loading ? "—" : card.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/journals/dashboard/articles/new"
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Send size={16} />
            Write New Article
          </Link>
          <Link
            href="/journals/dashboard/articles"
            className="flex items-center gap-2 bg-gray-100 text-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <FileText size={16} />
            View My Articles
          </Link>
          <Link
            href="/journals/dashboard/profile"
            className="flex items-center gap-2 bg-gray-100 text-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
