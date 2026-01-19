import React from 'react'
import Image from 'next/image'

export default function Vision() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* LEFT CONTENT */}
          <div>
            {/* BADGE */}
            <div className="inline-block mb-6">
              <span className="text-secondary text-sm font-medium tracking-wider uppercase">
                THE BEGINNING
              </span>
            </div>

            {/* HEADING */}
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">
              A Vision Born from Service
            </h2>

            {/* PARAGRAPHS */}
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                In 1963, the Society of Jesus established Loyola College of
                Social Sciences in Thiruvananthapuram, Kerala, with a singular
                mission: to create an institution that would combine academic
                rigor with social consciousness.
              </p>

              <p>
                Founded during a transformative period in India's history, the
                college was envisioned as a beacon of progressive education,
                dedicated to nurturing leaders who would serve society with
                competence and compassion.
              </p>

              <p>
                The Jesuit tradition of "men and women for others" became
                the cornerstone of our educational philosophy, shaping
                generations of graduates who have made meaningful
                contributions to Kerala and beyond.
              </p>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="relative aspect-[3/3] w-full overflow-hidden rounded-[5px] shadow-2xl">
              <Image
                src="/assets/historyvision.png" // Update with your actual image path
                alt="Historical classroom at Loyola College"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
