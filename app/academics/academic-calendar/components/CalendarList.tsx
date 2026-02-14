"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Download, FileText } from "lucide-react";

interface CalendarItem {
  id: number;
  academic_year: string;
  title: string;
  description: string | null;
  pdf_url: string | null;
  published_date: string;
}

export default function CalendarList() {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const res = await fetch("/api/academics/academic-calendar");
        if (res.ok) setItems(await res.json());
      } catch (err) {
        console.error("Error fetching academic calendar:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCalendar();
  }, []);

  // Get unique academic years
  const years = [
    "All",
    ...Array.from(new Set(items.map((i) => i.academic_year))),
  ];

  const filtered =
    selectedYear === "All"
      ? items
      : items.filter((i) => i.academic_year === selectedYear);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Academic Calendar
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access academic calendars and important documents for each academic year
          </p>
        </div>

        {/* Year filter */}
        {years.length > 2 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedYear === year
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {/* Calendar items */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {item.academic_year}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mb-4">
                      Published:{" "}
                      {new Date(item.published_date).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>

                    {item.pdf_url && (
                      <a
                        href={item.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors group-hover:shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No calendar items found
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
