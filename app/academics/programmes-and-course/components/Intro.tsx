import React from 'react'

export default function Intro() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Decorative divider */}
        <div className="flex justify-start mb-12">
          <div className="w-24 h-[3px] bg-primary"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* LEFT - HEADING */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Your Pathway<br />to Excellence
            </h2>
          </div>

          {/* RIGHT - DESCRIPTION */}
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Loyola College of Social Sciences offers a comprehensive suite of academic programmes spanning undergraduate, postgraduate, and doctoral levels. Each programme is carefully designed to provide rigorous theoretical foundations combined with practical experience.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our curriculum integrates traditional social sciences with emerging disciplines, preparing students for meaningful careers while fostering critical thinking, research excellence, and commitment to social transformation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
