"use client";

import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  Loader2, FileText, CheckCircle2, XCircle, Clock, Eye, Search,
  X, User, Tag, Calendar, BookOpen, ArrowLeft, Send,
} from "lucide-react";

interface Article {
  id: number;
  title: string;
  abstract: string;
  content: string;
  keywords: string;
  category: string;
  cover_image?: string;
  status: string;
  // MySQL flat fields
  first_name?: string;
  last_name?: string;
  author_email?: string;
  affiliation?: string;
  // Supabase nested fields
  journal_users?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    affiliation?: string;
  };
  // Legacy fields (if any)
  user_name?: string;
  user_email?: string;
  admin_remarks?: string;
  created_at: string;
  submitted_at: string;
  published_at?: string;
  reviewed_at?: string;
}

/* Helper to normalize author info from MySQL flat OR Supabase nested format */
function getAuthorInfo(article: Article) {
  // Supabase returns nested journal_users object
  const nested = article.journal_users;
  const firstName = article.first_name || nested?.first_name || "";
  const lastName = article.last_name || nested?.last_name || "";
  const email = article.author_email || article.user_email || nested?.email || "";
  const affiliation = article.affiliation || nested?.affiliation || "";
  const name =
    article.user_name ||
    [firstName, lastName].filter(Boolean).join(" ") ||
    "Unknown Author";

  return { name, email, affiliation };
}

/* ─────────────────────── Article Viewer Modal ─────────────────────── */

function ArticleViewer({
  article,
  onClose,
  onReview,
}: {
  article: Article;
  onClose: () => void;
  onReview: (id: number, action: "approve" | "reject", remarks: string) => Promise<void>;
}) {
  const [remarks, setRemarks] = useState("");
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const author = getAuthorInfo(article);
  const canReview = article.status === "submitted" || article.status === "under_review";

  const handleSubmitReview = async () => {
    if (!reviewAction) return;
    setSubmitting(true);
    await onReview(article.id, reviewAction, remarks);
    setSubmitting(false);
    setReviewAction(null);
    setRemarks("");
  };

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: "bg-gray-100", text: "text-gray-600", label: "Draft" },
    submitted: { bg: "bg-amber-50", text: "text-amber-600", label: "Submitted" },
    under_review: { bg: "bg-blue-50", text: "text-blue-600", label: "Under Review" },
    approved: { bg: "bg-green-50", text: "text-green-600", label: "Approved" },
    rejected: { bg: "bg-red-50", text: "text-red-600", label: "Rejected" },
  };

  const st = statusConfig[article.status] || statusConfig.draft;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Articles
            </button>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                {st.label}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Article Content — Page-like view */}
          <div className="px-6 md:px-12 lg:px-16 py-8">
            {/* Cover Image */}
            {article.cover_image && (
              <div className="mb-6 -mx-6 md:-mx-12 lg:-mx-16">
                <img
                  src={article.cover_image}
                  alt="Article cover"
                  className="w-full max-h-80 object-cover"
                />
              </div>
            )}

            {/* Category & Keywords Badge Row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {article.category && (
                <span className="inline-flex items-center gap-1.5 bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-medium">
                  <BookOpen size={12} />
                  {article.category}
                </span>
              )}
              {article.keywords &&
                article.keywords.split(",").map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs"
                  >
                    <Tag size={10} />
                    {kw.trim()}
                  </span>
                ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
              {article.title}
            </h1>

            {/* Author & Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{author.name}</p>
                  {author.email && (
                    <p className="text-xs text-gray-500">{author.email}</p>
                  )}
                  {author.affiliation && (
                    <p className="text-xs text-gray-400">{author.affiliation}</p>
                  )}
                </div>
              </div>
              <div className="sm:ml-auto flex flex-wrap items-center gap-4 text-xs text-gray-400">
                {article.submitted_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    Submitted: {new Date(article.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
                {article.published_at && (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-green-500" />
                    Published: {new Date(article.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
            </div>

            {/* Abstract */}
            {article.abstract && (
              <div className="mb-8">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Abstract
                </h2>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    {article.abstract}
                  </p>
                </div>
              </div>
            )}

            {/* Article Body */}
            {article.content && (
              <div className="mb-8">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Full Article
                </h2>
                <div
                  className="prose prose-sm sm:prose max-w-none
                    prose-headings:text-gray-900 prose-headings:font-bold
                    prose-p:text-gray-700 prose-p:leading-relaxed
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-primary prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4
                    prose-img:rounded-xl prose-img:shadow-md
                    prose-code:bg-gray-100 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm
                    prose-pre:bg-gray-900 prose-pre:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            )}

            {/* Previous Admin Remarks */}
            {article.admin_remarks && (
              <div className="mb-8">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Admin Remarks
                </h2>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                  <p className="text-sm text-amber-800">{article.admin_remarks}</p>
                  {article.reviewed_at && (
                    <p className="text-xs text-amber-500 mt-2">
                      Reviewed on {new Date(article.reviewed_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Review Actions — Sticky Footer */}
          {canReview && (
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
              {reviewAction === null ? (
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setReviewAction("reject")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                  <button
                    onClick={() => setReviewAction("approve")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors shadow-sm"
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Add remarks (optional)..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary pr-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setReviewAction(null);
                        setRemarks("");
                      }}
                      className="px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      disabled={submitting}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors shadow-sm disabled:opacity-50 ${
                        reviewAction === "approve"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {submitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      Confirm {reviewAction === "approve" ? "Approval" : "Rejection"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────── Admin Articles Page ─────────────────────── */

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);

  const fetchArticles = (status = "all") => {
    setLoading(true);
    fetch(`/api/journals/admin?type=articles&status=${status}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles(filter);
  }, [filter]);

  const handleReview = async (id: number, action: "approve" | "reject", remarks: string) => {
    try {
      const token = sessionStorage.getItem("admin-auth-token");
      const res = await fetch(`/api/journals/articles/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": token || "admin",
        },
        body: JSON.stringify({ action, remarks }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        setViewingArticle(null);
        fetchArticles(filter);
      } else {
        toast.error(data.error || "Failed to review");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const filteredArticles = articles.filter((a) => {
    const author = getAuthorInfo(a);
    return (
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      author.name.toLowerCase().includes(search.toLowerCase()) ||
      author.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const statusBadge = (status: string) => {
    const config: Record<string, string> = {
      draft: "bg-gray-100 text-gray-600",
      submitted: "bg-amber-50 text-amber-600",
      under_review: "bg-blue-50 text-blue-600",
      approved: "bg-green-50 text-green-600",
      rejected: "bg-red-50 text-red-600",
    };
    return config[status] || config.draft;
  };

  const statusCounts = {
    all: articles.length,
    submitted: articles.filter((a) => a.status === "submitted").length,
    under_review: articles.filter((a) => a.status === "under_review").length,
    approved: articles.filter((a) => a.status === "approved").length,
    rejected: articles.filter((a) => a.status === "rejected").length,
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Journal Article Submissions</h1>
          <p className="text-sm text-muted-foreground">{filteredArticles.length} article(s)</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {(["all", "submitted", "under_review", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === s
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {s === "all" ? "All" : s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                filter === s ? "bg-white/20" : "bg-gray-100"
              }`}>
                {statusCounts[s]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, author name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
          />
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground">No articles found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredArticles.map((article) => {
              const author = getAuthorInfo(article);

              return (
                <div
                  key={article.id}
                  className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => setViewingArticle(article)}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Cover thumbnail */}
                    {article.cover_image && (
                      <div className="w-full md:w-24 h-20 md:h-16 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={article.cover_image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusBadge(article.status)}`}>
                          {article.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        By: {author.name} {author.email && `(${author.email})`}
                      </p>
                      {article.abstract && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{article.abstract}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        {article.category && (
                          <span className="text-xs text-primary/70 flex items-center gap-1">
                            <BookOpen size={11} />
                            {article.category}
                          </span>
                        )}
                        <p className="text-xs text-gray-400">
                          Submitted: {article.submitted_at ? new Date(article.submitted_at).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingArticle(article);
                        }}
                        className="flex items-center gap-1.5 bg-primary/5 text-primary px-4 py-2 rounded-lg text-xs font-medium hover:bg-primary/10 transition-colors"
                      >
                        <Eye size={14} />
                        View Article
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Article Viewer Modal */}
      {viewingArticle && (
        <ArticleViewer
          article={viewingArticle}
          onClose={() => setViewingArticle(null)}
          onReview={handleReview}
        />
      )}
    </>
  );
}
