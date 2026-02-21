"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import {
  FileText, PenTool, Send, Trash2, Eye, Loader2,
  CheckCircle2, Clock, XCircle, FilePen, AlertCircle,
} from "lucide-react";

interface Article {
  id: number;
  title: string;
  abstract: string;
  status: string;
  created_at: string;
  submitted_at: string;
  published_at: string;
  admin_remarks: string;
}

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  draft: { label: "Draft", icon: FilePen, className: "bg-gray-100 text-gray-600" },
  submitted: { label: "Submitted", icon: Clock, className: "bg-amber-50 text-amber-600" },
  under_review: { label: "Under Review", icon: Clock, className: "bg-blue-50 text-blue-600" },
  approved: { label: "Published", icon: CheckCircle2, className: "bg-green-50 text-green-600" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-red-50 text-red-600" },
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);

  const fetchArticles = () => {
    setLoading(true);
    fetch("/api/journals/articles")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = async (id: number) => {
    if (!confirm("Submit this article for review? You won't be able to edit it after submission.")) return;
    setSubmitting(id);
    try {
      const res = await fetch(`/api/journals/articles/${id}/submit`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Article submitted!");
        fetchArticles();
      } else {
        toast.error(data.error || "Failed to submit");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this draft? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/journals/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Article deleted");
        fetchArticles();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Articles</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your article submissions</p>
          </div>
          <Link
            href="/journals/dashboard/articles/new"
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <PenTool size={16} />
            New Article
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No articles yet</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Start by writing your first article
            </p>
            <Link
              href="/journals/dashboard/articles/new"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <PenTool size={16} />
              Write New Article
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => {
              const config = statusConfig[article.status] || statusConfig.draft;
              const StatusIcon = config.icon;
              return (
                <div
                  key={article.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground truncate">
                          {article.title}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
                          <StatusIcon size={12} />
                          {config.label}
                        </span>
                      </div>
                      {article.abstract && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {article.abstract}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Created: {new Date(article.created_at).toLocaleDateString()}
                        {article.submitted_at && ` • Submitted: ${new Date(article.submitted_at).toLocaleDateString()}`}
                        {article.published_at && ` • Published: ${new Date(article.published_at).toLocaleDateString()}`}
                      </p>
                      {article.status === "rejected" && article.admin_remarks && (
                        <div className="mt-3 flex items-start gap-2 bg-red-50 text-red-700 text-xs p-3 rounded-lg">
                          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                          <p><strong>Review Feedback:</strong> {article.admin_remarks}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {article.status === "draft" && (
                        <>
                          <Link
                            href={`/journals/dashboard/articles/${article.id}/edit`}
                            className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                          >
                            <FilePen size={14} />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleSubmit(article.id)}
                            disabled={submitting === article.id}
                            className="flex items-center gap-1.5 bg-primary text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                          >
                            {submitting === article.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            Submit
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                      {article.status === "approved" && (
                        <Link
                          href={`/journals/articles/${article.id}`}
                          className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                        >
                          <Eye size={14} />
                          View Published
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
