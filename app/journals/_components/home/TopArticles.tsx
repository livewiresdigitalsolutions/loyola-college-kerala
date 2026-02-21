"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";

interface PublicArticle {
  id: number;
  title: string;
  abstract: string;
  user_name: string;
  published_at: string;
  category: string;
}

export default function TopArticles() {
  const [articles, setArticles] = useState<PublicArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journals/articles/public?limit=3")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setArticles(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="w-10 h-1 bg-primary rounded-full mb-3"></div>
            <h2 className="text-3xl font-bold text-foreground">Latest Publications</h2>
            <p className="text-muted-foreground mt-1">Recently published articles in our journal</p>
          </div>
          <Link
            href="/journals/archives"
            className="hidden md:flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
          >
            View All Archives
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 group"
            >
              {article.category && (
                <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full mb-3">
                  {article.category}
                </span>
              )}
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              {article.abstract && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {article.abstract}
                </p>
              )}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <p className="text-xs text-gray-400">
                  By {article.user_name}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(article.published_at).toLocaleDateString()}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Coming Soon Premium Section */}
        <div className="mt-12 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 rounded-2xl p-8 text-center">
          <BookOpen size={32} className="text-primary mx-auto mb-3" />
          <h3 className="text-xl font-bold text-foreground mb-2">Premium Access Coming Soon</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Full-text access to all published articles will be available soon.
            Subscribe to get notified when premium features launch.
          </p>
        </div>

        <div className="md:hidden mt-8 text-center">
          <Link
            href="/journals/archives"
            className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
          >
            View All Archives
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
