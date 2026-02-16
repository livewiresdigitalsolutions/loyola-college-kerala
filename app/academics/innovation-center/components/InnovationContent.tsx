import React from 'react'
import {
  Rocket,
  Pencil,
  Leaf,
  FlaskConical,
  Globe,
  Lightbulb,
  FileText,
  ExternalLink,
  Download,
} from 'lucide-react'

// ─── TIMELINE DATA ───────────────────────────────────────────
const timelineEvents = [
  {
    year: '2009',
    icon: Rocket,
    title: 'Birth of LIFE',
    description:
      'Loyola Innovation and Field Engagement (LIFE) was established as a voluntary initiative led by the Social Work Department.',
  },
  {
    year: '2010',
    icon: Pencil,
    title: 'Pencil Foundation',
    description:
      'One of the earliest activities of LIFE, focused on social impact initiatives.',
  },
  {
    year: '2011',
    icon: Leaf,
    title: 'Thanal Herbarium',
    description:
      'Establishment of herbarium project contributing to biodiversity conservation and research.',
  },
  {
    year: '2013',
    icon: FlaskConical,
    title: 'LiveLab Launch',
    description:
      'The first successful innovative project initiated by LIFE, transforming ideas into action.',
  },
  {
    year: '2015',
    icon: Globe,
    title: 'International Conclave',
    description:
      'LCSS sponsored an International Conclave on Innovation and Social Entrepreneurship group in December.',
  },
  {
    year: '2015',
    icon: Lightbulb,
    title: 'IEDC Formation',
    description:
      'LIFE was reorganised as Innovation and Entrepreneurship Development Cell (IEDC) in partnership with Kerala Start-Up Mission.',
  },
]

// ─── MAIN COMPONENT ─────────────────────────────────────────
export default function InnovationContent() {
  return (
    <>
      {/* ── INTRO SECTION ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Decorative divider */}
          <div className="flex justify-start mb-12">
            <div className="w-24 h-[3px] bg-primary"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left — Heading */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                From Seeds<br />to Ecosystem
              </h2>
            </div>

            {/* Right — Description */}
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Loyola Innovation Centre took roots from the seeds sown by a voluntary
                and informal body called Loyola Innovation and Field Engagement (LIFE).
                LIFE was a think-tank of like minded research scholars, students, alumni and
                well-wishers of LCSS who are passionate about social change through
                innovation and enterprise.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This platform, constituted serendipitously in 2009, was led by the Social
                Work Department. LIFE convened meetings of members to assess
                issues, generate ideas, design plans and instruments for social change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE SECTION ──────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: '#F6F6EE' }}>
        <div className="max-w-5xl mx-auto px-6">
          {/* Decorative line */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-[3px] bg-primary"></div>
          </div>

          {/* Section heading — centered */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Journey of Innovation
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From a small informal group to a structured innovation ecosystem—our evolution
              over the years.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-primary/20 -translate-x-1/2 hidden md:block"></div>

            {/* Desktop timeline */}
            <div className="hidden md:block">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon
                const isLeft = index % 2 === 0
                return (
                  <div key={index} className="relative flex items-center mb-16 last:mb-0">
                    {/* Left side */}
                    <div className="w-1/2 pr-12">
                      {isLeft ? (
                        <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow ml-auto max-w-sm text-right">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                        </div>
                      ) : (
                        <p className="text-3xl md:text-4xl font-bold text-[#F0B129] text-right">{event.year}</p>
                      )}
                    </div>

                    {/* Center icon */}
                    <div className="absolute left-1/2 -translate-x-1/2 z-10">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="w-1/2 pl-12">
                      {isLeft ? (
                        <p className="text-3xl md:text-4xl font-bold text-[#F0B129]">{event.year}</p>
                      ) : (
                        <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow max-w-sm">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Mobile timeline */}
            <div className="md:hidden space-y-8">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#F0B129] mb-1">{event.year}</p>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── IEDC DOCUMENTATION SECTION ────────────────────── */}
      <section className="py-20 bg-primary">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left — CTA */}
            <div>
              {/* Decorative line */}
              <div className="flex justify-start mb-6">
                <div className="w-16 h-[3px] bg-white/40"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                Learn More About Our Innovation Journey
              </h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                Access comprehensive documentation about Loyola IEDC&apos;s initiatives,
                achievements, and impact. Discover how we&apos;re fostering innovation and
                entrepreneurship within our academic community.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-md hover:bg-white/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download IEDC Documentation
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Right — IEDC Report Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-md border border-white/20 p-8">
              <div className="w-14 h-14 bg-white/20 rounded-md flex items-center justify-center mb-5">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#F0B129] mb-3">Official IEDC Report</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Comprehensive documentation of our Innovation and Entrepreneurship
                Development Cell activities, partnerships,
                and outcomes.
              </p>
              <div className="border-t border-white/20 pt-4">
                <p className="text-white/50 text-xs font-medium">PDF Document</p>
                <p className="text-white/40 text-xs">IEDC Manual</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
