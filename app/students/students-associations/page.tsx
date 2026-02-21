"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { AssociationListItem } from "./_data/associations";

export default function StudentAssociationsPage() {
  const [associations, setAssociations] = useState<AssociationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    fetch("/api/associations")
      .then((res) => res.json())
      .then((data) => {
        setAssociations(data);
        if (data.length > 0) setActiveId(data[0].slug);
      })
      .catch((err) => console.error("Error fetching associations:", err))
      .finally(() => setLoading(false));
  }, []);

  const active = associations.find((a) => a.slug === activeId);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="relative bg-[var(--primary)] pt-36 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 opacity-10 bg-[url('/assets/loyola-building.png')] bg-cover bg-center" />
          <div className="relative max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Student Associations
            </h1>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]" />
          </div>
        </section>
      </main>
    );
  }

  if (!active) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ───── Hero Banner ───── */}
      <section className="relative bg-[var(--primary)] pt-36 pb-16 px-4 sm:px-6 lg:px-8">
        {/* subtle texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('/assets/loyola-building.png')] bg-cover bg-center" />

        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center text-white/70 text-sm mb-5">
            <Link href="/" className="hover:text-white transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 inline -mt-0.5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
                />
              </svg>
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2" />
            <span>Student</span>
            <ChevronRight className="w-3.5 h-3.5 mx-2" />
            <span className="text-[var(--secondary)] font-medium">
              Student Associations
            </span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Student Associations
          </h1>
        </div>
      </section>

      {/* ───── Main Content ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row">
            {/* ── Left Sidebar ── */}
            <div className="md:w-[320px] border-r border-gray-100 py-8 px-6">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-6">
                Select Association
              </p>

              <ul className="space-y-1">
                {associations.map((assoc) => {
                  const isActive = assoc.slug === activeId;
                  return (
                    <li key={assoc.slug}>
                      <button
                        onClick={() => setActiveId(assoc.slug)}
                        className={`w-full text-left px-4 py-4 rounded-lg transition-all duration-200 group relative
                          ${
                            isActive
                              ? "bg-green-50"
                              : "hover:bg-gray-50"
                          }`}
                      >
                        {/* Active indicator bar */}
                        <span
                          className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full transition-all duration-300
                            ${
                              isActive
                                ? "bg-[var(--primary)] opacity-100"
                                : "bg-transparent opacity-0 group-hover:opacity-40 group-hover:bg-gray-300"
                            }`}
                        />

                        <span
                          className={`block text-base font-bold transition-colors ${
                            isActive
                              ? "text-[var(--primary)]"
                              : "text-gray-800 group-hover:text-gray-900"
                          }`}
                        >
                          {assoc.name}
                        </span>
                        <span className="block text-xs text-gray-400 mt-0.5 leading-snug">
                          {assoc.full_name.length > 40
                            ? assoc.full_name.substring(0, 40) + "..."
                            : assoc.full_name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ── Right Content ── */}
            <div className="flex-1 p-6 md:p-8" key={activeId}>
              {/* Banner Image Card */}
              <div
                className={`relative rounded-xl overflow-hidden h-[280px] md:h-[320px] bg-gradient-to-br ${active.banner_gradient}`}
              >
                {/* Decorative swirl pattern */}
                <div className="absolute inset-0 opacity-20">
                  <svg
                    viewBox="0 0 800 400"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <defs>
                      <linearGradient
                        id="swirl"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                        <stop
                          offset="100%"
                          stopColor="white"
                          stopOpacity="0.05"
                        />
                      </linearGradient>
                    </defs>
                    <circle cx="200" cy="200" r="180" fill="url(#swirl)" />
                    <circle cx="600" cy="150" r="120" fill="url(#swirl)" />
                    <circle cx="400" cy="300" r="100" fill="url(#swirl)" />
                  </svg>
                </div>

                {/* Large abbreviation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[100px] md:text-[140px] font-black text-white/15 select-none tracking-wider">
                    {active.name}
                  </span>
                </div>

                {/* Badge */}
                <div className="absolute top-5 left-5">
                  <span
                    className="inline-block px-3 py-1 text-xs font-semibold text-white rounded-md shadow-sm"
                    style={{ backgroundColor: active.tag_color }}
                  >
                    {active.category}
                  </span>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
                    {active.full_name}
                  </h2>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  {active.description}
                </p>
              </div>

              {/* View Full Details Button */}
              <div className="mt-8">
                <Link
                  href={`/students/students-associations/${active.slug}`}
                  className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[var(--primary)]/90 transition-all duration-200 shadow-md hover:shadow-lg group"
                >
                  View Full Details
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
