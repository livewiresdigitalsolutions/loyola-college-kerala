'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, Calendar, ArrowRight, Loader2 } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = 'Cultural' | 'Academic' | 'Campus Life' | 'Seminars & Workshops' | 'Announcements' | string

interface EventReport {
  id: number
  category: Category
  date: string
  month_year: string
  title: string
  description: string
  image: string
  lead_text?: string
  body?: string[]
  gallery?: string[]
}

interface MonthGroup {
  month: string
  reports: EventReport[]
}

// ─── Category badge colours ───────────────────────────────────────────────────

const BADGE_COLOURS: Record<Category, string> = {
  'Cultural':            'bg-amber-50 text-amber-700',
  'Academic':            'bg-blue-50 text-blue-700',
  'Campus Life':         'bg-emerald-50 text-emerald-700',
  'Seminars & Workshops':'bg-purple-50 text-purple-700',
  'Announcements':       'bg-rose-50 text-rose-700',
}

// Fallback to primary color if category not in BADGE_COLOURS
function getBadgeColor(cat: string) {
  return BADGE_COLOURS[cat] || 'bg-gray-100 text-gray-700';
}

// ─── Report Card ─────────────────────────────────────────────────────────────

function ReportCard({ report, index, onOpenReport }: { report: EventReport; index: number; onOpenReport: () => void }) {
  const isReversed = index % 2 !== 0
  return (
    <div className={`flex flex-col gap-5 py-2 ${isReversed ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
      {/* Image */}
      <div className="relative w-full sm:w-44 h-40 sm:h-auto shrink-0 rounded-sm overflow-hidden bg-gray-200">
        <Image
          src={report.image || '/assets/loyola-building.png'}
          alt={report.title}
          fill
          className="object-cover"
        />
        {/* Category badge */}
        <span
          className={`absolute top-2 left-2 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${getBadgeColor(report.category)}`}
        >
          {report.category}
        </span>
      </div>

      {/* Body — mirrors alignment based on card position */}
      <div className={`flex flex-col justify-center gap-2 ${isReversed ? 'sm:items-end sm:text-right' : 'items-start text-left'}`}>
        {/* Date */}
        <p className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest ${isReversed ? 'sm:flex-row-reverse' : ''}`} style={{ color: '#F0B129' }}>
          <Calendar className="w-3 h-3 shrink-0" />
          {report.date}
        </p>
        {/* Title */}
        <h3 className="text-base font-bold text-primary leading-snug">{report.title}</h3>
        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{report.description}</p>
        {/* CTA */}
        <button 
          onClick={onOpenReport}
          className={`mt-1 inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all duration-200 ${isReversed ? 'sm:flex-row-reverse' : ''}`}
        >
          View Full Report &amp; Gallery <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Month Accordion ─────────────────────────────────────────────────────────

function MonthAccordion({ group, defaultOpen, onOpenReport }: { group: MonthGroup; defaultOpen?: boolean; onOpenReport: (report: EventReport) => void }) {
  const [open, setOpen] = useState(defaultOpen ?? false)

  return (
    <div className="mb-6 last:mb-0">
      {/* Accordion Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-left group px-4 py-3 rounded-md transition-colors hover:opacity-90"
        style={{ backgroundColor: '#F6F6EE' }}
      >
        <h2 className="text-xl font-bold text-primary group-hover:opacity-80 transition-opacity">
          {group.month}
        </h2>
        {open
          ? <ChevronUp className="w-5 h-5 text-primary shrink-0" />
          : <ChevronDown className="w-5 h-5 text-primary shrink-0" />
        }
      </button>

      {/* Accordion Body */}
      {open && (
        <div className="mt-5 flex flex-col">
          {group.reports.map((report, idx) => (
            <React.Fragment key={report.id}>
              {idx > 0 && <hr className="border-gray-200 my-4" />}
              <ReportCard report={report} index={idx} onOpenReport={() => onOpenReport(report)} />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Report Modal ──────────────────────────────────────────────────────────────

import { X } from 'lucide-react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas-pro'

function ReportModal({ item, onClose }: { item: EventReport; onClose: () => void }) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = React.useState(false)

  // Lock body scroll while modal is open (except when printing)
  React.useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleDownloadPDF = async () => {
    const element = contentRef.current
    if (!element || isDownloading) return

    try {
      setIsDownloading(true)
      
      // Generate canvas at higher scale for better quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      })
      
      const imgData = canvas.toDataURL('image/png')
      
      // Calculate A4 dimensions in mm
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      let heightLeft = pdfHeight
      let position = 0
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
      heightLeft -= pdf.internal.pageSize.getHeight()
      
      // Add remaining pages if content is taller than one A4 page
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
        heightLeft -= pdf.internal.pageSize.getHeight()
      }
      
      const filename = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
      pdf.save(filename)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const galleryImages = (item.gallery && item.gallery.length > 0) ? item.gallery : [item.image, item.image];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:static print:p-0 print:block"
      onClick={onClose}
    >
      {/* Backdrop (hidden when printing) */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm print:hidden" />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl flex flex-col print:shadow-none print:max-h-max print:max-w-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto w-full h-full flex flex-col print:overflow-visible">
          {/* Content to be converted to PDF */}
          <div ref={contentRef} className="bg-white">
            {/* Hero Image section */}
            <div className="relative w-full h-64 shrink-0 print:h-80">
               <Image src={item.image || '/assets/loyola-building.png'} alt={item.title} fill className="object-cover" />
               <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent" />
               
               {/* Close button (hidden when printing) */}
               <button
                 onClick={onClose}
                 className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-1.5 transition-colors z-20 print:hidden"
                 data-html2canvas-ignore="true"
               >
                 <X className="w-5 h-5" />
               </button>

               {/* Content Overlay */}
               <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                  <span className="inline-block bg-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-primary mb-3">
                    {item.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {item.title}
                  </h2>
               </div>
            </div>

            {/* Body Section */}
            <div className="p-6 sm:p-8 flex flex-col gap-6 text-left">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                 <Calendar className="w-4 h-4" />
                 HELD ON {item.date}
              </p>

              <p className="text-primary font-medium text-base sm:text-lg leading-relaxed">
                {item.lead_text || item.description}
              </p>

              <div className="text-sm text-gray-600 leading-relaxed flex flex-col gap-4">
                {item.body && item.body.length > 0 ? item.body.map((p, i) => <p key={i}>{p}</p>) : (
                  <>
                    <p>The event saw remarkable participation from across the campus and beyond. Guest speakers and prominent faculty members contributed to enriching discussions, fostering an environment of collaborative learning and cultural appreciation.</p>
                    <p>&quot;Witnessing the dedication and enthusiasm of our students and guests today reassures us of the bright future ahead,&quot; noted the event coordinator. &quot;These gatherings are not just a tradition; they are the bedrock of our institutional values.&quot;</p>
                  </>
                )}
              </div>

              <div className="mt-4 print:mt-8">
                 <h3 className="text-xl font-bold text-primary mb-4">Gallery Highlights</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="relative h-32 sm:h-48 rounded-md overflow-hidden bg-gray-100 print:h-64">
                       <Image src={galleryImages[0] || '/assets/loyola-building.png'} alt="Gallery image 1" fill className="object-cover" />
                    </div>
                    <div className="relative h-32 sm:h-48 rounded-md overflow-hidden bg-gray-100 print:h-64">
                       <Image src={galleryImages[1] || galleryImages[0] || '/assets/loyola-building.png'} alt="Gallery image 2" fill className="object-cover" />
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:px-8 border-t border-gray-100 print:hidden shrink-0 mt-auto">
             <button 
               onClick={handleDownloadPDF}
               disabled={isDownloading}
               className="flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-80 disabled:opacity-50" 
               style={{ color: '#F0B129' }}
             >
               {isDownloading ? (
                 <span className="flex items-center gap-2">Generating PDF...</span>
               ) : (
                 <>Download Full Event PDF <ArrowRight className="w-4 h-4" /></>
               )}
             </button>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EventReportsContent() {
  const [reports, setReports] = useState<MonthGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedReport, setSelectedReport] = useState<EventReport | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/sys-ops/event-reports');
        if (res.ok) {
          const data = await res.json();
          
          // Group by month_year
          const grouped = data.reports.reduce((acc: MonthGroup[], current: any) => {
            const existing = acc.find(g => g.month === current.month_year);
            const report = {
              ...current,
              body: typeof current.body === 'string' ? JSON.parse(current.body) : current.body,
              gallery: typeof current.gallery === 'string' ? JSON.parse(current.gallery) : current.gallery
            };
            if (existing) {
              existing.reports.push(report);
            } else {
              acc.push({ month: current.month_year, reports: [report] });
            }
            return acc;
          }, []);
          setReports(grouped);
        }
      } catch (error) {
        console.error('Error fetching event reports:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const hasMore = visibleCount < reports.length

  if (loading) {
     return (
        <div className="flex justify-center items-center py-32 w-full bg-white">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
     )
  }

  return (
    <>
      {selectedReport && (
        <ReportModal item={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
      <section className="bg-white py-14 px-4">
      <div className="max-w-4xl mx-auto">
        {reports.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No event reports available yet.</p>
          </div>
        ) : (
          reports.slice(0, visibleCount).map((group, i) => (
            <MonthAccordion key={group.month} group={group} defaultOpen={i === 0} onOpenReport={setSelectedReport} />
          ))
        )}

        {/* Load Older Reports button */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount((c) => c + 3)}
              className="px-8 py-3 border border-gray-200 rounded-lg text-sm font-bold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
            >
              Load Older Reports
            </button>
          </div>
        )}
      </div>
    </section>
    </>
  )
}
