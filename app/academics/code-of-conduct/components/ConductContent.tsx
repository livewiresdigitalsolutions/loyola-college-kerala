import React from 'react'
import { FileText, ShieldAlert, Ban } from 'lucide-react'

// ─── POLICY DATA ─────────────────────────────────────────────
const policies = [
  {
    icon: FileText,
    title: 'Rules and Guidelines Concerning Coursework, Attendance, and Assessment',
    description:
      'Comprehensive guidelines covering academic expectations, coursework submission requirements, attendance policies, and assessment procedures. These rules ensure fair and consistent academic standards across all programmes and maintain the integrity of our educational process.',
  },
  {
    icon: ShieldAlert,
    title: 'Rules for Dealing with Cases of Cheating and Academic Dishonesty',
    description:
      'Strict policies addressing instances of cheating, copying in examinations, plagiarism in assignments, falsification of field work reports, and unauthorized collaboration in project reports. These rules outline investigation procedures, disciplinary actions, and appeals processes to maintain academic honesty.',
  },
  {
    icon: Ban,
    title: 'Rules Prohibiting Ragging',
    description:
      'The college strictly follows the circular issued by the UGC regarding \'Curbing the menace of ragging in Higher Educational Institutions.\' We maintain a zero-tolerance policy towards any form of ragging, harassment, or bullying, ensuring a safe and respectful environment for all students.',
  },
]

// ─── MAIN COMPONENT ─────────────────────────────────────────
export default function ConductContent() {
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
                Our Commitment<br />to Excellence
              </h2>
            </div>

            {/* Right — Description */}
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                At Loyola College of Social Sciences, we are committed to maintaining the
                highest standards of academic integrity, ethical conduct, and personal
                responsibility. Our Code of Conduct establishes clear expectations for all
                members of our community.
              </p>
              <p className="text-gray-600 leading-relaxed">
                These guidelines ensure a safe, respectful, and conducive learning
                environment that promotes academic excellence and personal growth for
                all students, faculty, and staff.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ── POLICIES SECTION ──────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: '#F6F6EE' }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Section heading */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Essential Policies & Guidelines
            </h2>
            <p className="text-gray-500 max-w-2xl">
              Our code of conduct encompasses key areas that ensure academic integrity and
              student safety.
            </p>
          </div>

          {/* Policy cards — stacked */}
          <div className="space-y-6">
            {policies.map((policy, index) => {
              const Icon = policy.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                        {policy.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {policy.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
