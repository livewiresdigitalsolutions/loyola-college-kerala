"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type NewsItem = {
  id: number;
  category: string;
  date: string;
  title: string;
  excerpt?: string;
  image?: string;
};

// Removed fallback articles as per user request (content managed via admin)
function formatDate(raw: string) {
  try {
    return new Date(raw).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return raw;
  }
}

// ── Small card ────────────────────────────────────────────────────────────────
function NewsCard({ article }: { article: NewsItem }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 space-y-3 group flex-1 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{formatDate(article.date)}</span>
          <span>•</span>
          <span className="font-medium">{article.category}</span>
        </div>

        <h4 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors duration-300">
          {article.title}
        </h4>

        {article.excerpt && (
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        )}
      </div>

      <Link
        href="/news-and-events/news-and-upcoming-events"
        className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 text-sm w-fit"
      >
        <span className="relative">
          Read More
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
        </span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LatestNews() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [featured, setFeatured] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/sys-ops/news");
        const data = await res.json();
        if (data.success && Array.isArray(data.news) && data.news.length > 0) {
          const all: NewsItem[] = data.news;
          setFeatured(all[0]);
          setArticles(all.slice(1, 4));
        } else {
          setFeatured(null);
          setArticles([]);
        }
      } catch {
        setFeatured(null);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <section className="w-full bg-[#F6F6EE] py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-sm font-bold text-gray-900 tracking-wider mb-3">
              STAY INFORMED
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tighter">
              Latest News &amp; Updates
            </h2>
          </div>
          <Link
            href="/news-and-events/news-and-upcoming-events"
            className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 group"
          >
            <span className="relative font-bold">
              View All News
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
            </span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* CONTENT */}
        {!loading && featured && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FEATURED CARD */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl h-[600px] lg:h-[700px] flex flex-col">
                {/* IMAGE */}
                <div className="relative flex-[65] overflow-hidden">
                  <Image
                    src={featured?.image || "/assets/loyola.png"}
                    alt={featured?.title || "Featured news"}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {/* BADGE */}
                  <div className="absolute top-6 left-6">
                    <span className="inline-block px-4 py-1.5 text-xs font-semibold rounded-md bg-primary text-white uppercase tracking-wider">
                      Featured
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-8 flex-[35] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{featured ? formatDate(featured.date) : ""}</span>
                      <span>•</span>
                      <span>{featured?.category}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight tracking-tighter">
                      {featured?.title}
                    </h3>

                    {featured?.excerpt && (
                      <p className="text-gray-700 leading-relaxed line-clamp-2">
                        {featured.excerpt}
                      </p>
                    )}
                  </div>

                  <Link
                    href="/news-and-events/news-and-upcoming-events"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 group w-fit"
                  >
                    <span className="relative font-bold">
                      Read Full Article
                      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT 3 CARDS */}
            <div className="lg:col-span-1">
              <div className="h-[600px] lg:h-[700px] flex flex-col gap-6">
                {articles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
                {/* Fill empty slots if fewer than 3 */}
                {articles.length === 0 &&
                  [0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gray-100 rounded-2xl animate-pulse"
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !featured && (
          <div className="text-center py-20 text-gray-500">
            No recent updates at this moment. Stay tuned.
          </div>
        )}

        {/* MOBILE VIEW ALL */}
        <Link
          href="/news-and-events/news-and-upcoming-events"
          className="md:hidden inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 group mt-8"
        >
          <span className="relative">
            View All News
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
          </span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
