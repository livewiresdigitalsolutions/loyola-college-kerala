import React from 'react'

export default function VisionMission() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* VISION & MISSION CARDS */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* VISION CARD */}
          <div className="bg-[#F6F6EE] p-8 md:p-12 rounded-lg">
            <div className="mb-6">
              <div className="w-12 h-1 bg-primary mb-4"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Vision
              </h2>
            </div>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              To foster excellence in thought, commitment, and engagement, enabling
              holistic transformation of individuals and society.
            </p>
          </div>

          {/* MISSION CARD */}
          <div className="bg-primary p-8 md:p-12 rounded-lg">
            <div className="mb-6">
              <div className="w-12 h-1 bg-white mb-4"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Mission
              </h2>
            </div>
            <p className="text-white/90 text-base md:text-lg leading-relaxed">
              To enhance engaged competence by nurturing globally competent, socially
              sensitive, ecologically responsive, and ethically grounded individuals,
              prepared to emerge as thought leaders and agents of change.
            </p>
          </div>
        </div>

        {/* MOTTO SECTION */}
        <div className="bg-primary py-12 md:py-16 px-6 rounded-lg text-center">
          <span className="text-[#F0B129] text-sm font-medium tracking-widest uppercase mb-4 block">
            OUR MOTTO
          </span>
          <h3 className="text-3xl md:text-5xl font-bold text-white">
            Excellence in Life through Service
          </h3>
        </div>
      </div>
    </section>
  )
}
