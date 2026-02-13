'use client'

import React from 'react'
import { Calendar, Download, Eye } from 'lucide-react'

// ─── ACADEMIC YEAR DATA ──────────────────────────────────────
interface AcademicYear {
  year: string
  dateRange: string
  isCurrent?: boolean
  calendarUrl?: string
  pdfUrl?: string
}

const academicYears: AcademicYear[] = [
  {
    year: '2025-2026',
    dateRange: 'June 2025 – May 2026',
    isCurrent: true,
    calendarUrl: '#',
    pdfUrl: '#',
  },
  {
    year: '2024-2025',
    dateRange: 'June 2024 – May 2025',
    calendarUrl: '#',
    pdfUrl: '#',
  },
  {
    year: '2023-2024',
    dateRange: 'June 2023 – May 2024',
    calendarUrl: '#',
    pdfUrl: '#',
  },
  {
    year: '2022-2023',
    dateRange: 'June 2022 – May 2023',
    calendarUrl: '#',
    pdfUrl: '#',
  },
  {
    year: '2021-2022',
    dateRange: 'June 2021 – May 2022',
    calendarUrl: '#',
    pdfUrl: '#',
  },
]

// ─── YEAR CARD COMPONENT ────────────────────────────────────
function YearCard({ year }: { year: AcademicYear }) {
  return (
    <div
      className={`rounded-lg border transition-all duration-300 ${
        year.isCurrent
          ? 'bg-primary text-white border-primary shadow-lg'
          : 'bg-white border-gray-200 hover:border-primary/30 hover:shadow-md'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 gap-4">
        {/* Left side — icon + info */}
        <div className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              year.isCurrent ? 'bg-white/20' : 'bg-primary/10'
            }`}
          >
            <Calendar
              className={`w-5 h-5 ${year.isCurrent ? 'text-white' : 'text-primary'}`}
            />
          </div>
          <div>
            <h3
              className={`font-bold text-base md:text-lg ${
                year.isCurrent ? 'text-white' : 'text-gray-900'
              }`}
            >
              Academic Year {year.year}
            </h3>
            <p
              className={`text-sm ${
                year.isCurrent ? 'text-white/70' : 'text-gray-500'
              }`}
            >
              {year.dateRange}
            </p>
          </div>
        </div>

        {/* Right side — buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {year.isCurrent && (
            <span className="text-xs font-semibold bg-[#F0B129] text-gray-900 px-3 py-1 rounded-full">
              Current
            </span>
          )}
          <a
            href={year.calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
              year.isCurrent
                ? 'border-white/30 text-white hover:bg-white/10'
                : 'border-primary text-primary hover:bg-primary hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            View Calendar
          </a>
          <a
            href={year.pdfUrl}
            download
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
              year.isCurrent
                ? 'border-white/30 text-white hover:bg-white/10'
                : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
            }`}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────
export default function CalendarList() {
  return (
    <section className="py-20" style={{ backgroundColor: '#F6F6EE' }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Decorative divider */}
        <div className="flex justify-start mb-8">
          <div className="w-24 h-[3px] bg-primary"></div>
        </div>

        {/* Section heading */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Select Academic Year
          </h2>
          <p className="text-gray-500">
            Click on any academic year to view the calendar or download the PDF
            version.
          </p>
        </div>

        {/* Year cards */}
        <div className="space-y-4">
          {academicYears.map((year, index) => (
            <YearCard key={index} year={year} />
          ))}
        </div>
      </div>
    </section>
  )
}
