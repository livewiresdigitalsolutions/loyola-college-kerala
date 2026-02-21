"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2, User, Tag, Calendar, BookOpen, ArrowLeft, CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  abstract: string;
  content: string;
  keywords: string;
  category: string;
  cover_image?: string;
  status: string;
  first_name?: string;
  last_name?: string;
  author_email?: string;
  affiliation?: string;
  journal_users?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    affiliation?: string;
  };
  submitted_at: string;
  published_at?: string;
}

function getAuthorInfo(article: Article) {
  const nested = article.journal_users;
  const firstName = article.first_name || nested?.first_name || "";
  const lastName = article.last_name || nested?.last_name || "";
  const affiliation = article.affiliation || nested?.affiliation || "";
  const name = [firstName, lastName].filter(Boolean).join(" ") || "Unknown Author";
  return { name, affiliation };
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/journals/articles/${articleId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Article not found or not accessible");
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setArticle(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load article");
        setLoading(false);
      });
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <BookOpen size={28} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Article Not Found</h2>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          {error || "This article may have been removed or is not yet published."}
        </p>
        <Link
          href="/journals"
          className="flex items-center gap-2 text-sm text-primary font-medium hover:underline mt-2"
        >
          <ArrowLeft size={16} />
          Back to Journals
        </Link>
      </div>
    );
  }

  const author = getAuthorInfo(article);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Back Link */}
      <Link
        href="/journals"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Journals
      </Link>

      {/* Cover Image */}
      {article.cover_image && (
        <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full max-h-[400px] object-cover"
          />
        </div>
      )}

      {/* Category & Keywords */}
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
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
        {article.title}
      </h1>

      {/* Author & Meta Info */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{author.name}</p>
            {author.affiliation && (
              <p className="text-xs text-gray-500">{author.affiliation}</p>
            )}
          </div>
        </div>
        <div className="sm:ml-auto flex flex-wrap items-center gap-4 text-xs text-gray-400">
          {article.published_at && (
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-green-500" />
              Published: {new Date(article.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
          {!article.published_at && article.submitted_at && (
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              Submitted: {new Date(article.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
        </div>
      </div>

      {/* Abstract */}
      {article.abstract && (
        <div className="mb-10">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Abstract
          </h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <p className="text-gray-700 leading-relaxed italic">
              {article.abstract}
            </p>
          </div>
        </div>
      )}

      {/* Article Body */}
      {article.content && (
        <article>
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-primary prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-5
              prose-img:rounded-xl prose-img:shadow-md
              prose-code:bg-gray-100 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5
              prose-pre:bg-gray-900 prose-pre:rounded-xl
              prose-li:text-gray-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      )}
    </div>
  );
}
