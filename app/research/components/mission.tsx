import React from 'react'

export default function Mission() {
  return (
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
              Our Mission
            </h2>
          </div>

          {/* Right — Description */}
          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>
              The world is becoming increasingly complex, competitive, data-driven, and
              knowledge-intensive. Loyola&apos;s mission is to make its students globally
              competent for which they have to be deeply knowledgeable and willing to
              be lifelong learners.
            </p>
            <p>
              We felt that it was high time we went beyond the existing Research Clinic
              and brought teachers, research scholars and students of all
              departments on a synergistic platform that promoted multidisciplinary
              and different opportunities for growing together by enriching one another.
              That is why we evolved Loyola Research Collective (LRC).
            </p>
            <p>
              The knowledge of and aptitude for research culture and aptitude
              among students and faculty members by promoting the practice of
              learning and growing together.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
