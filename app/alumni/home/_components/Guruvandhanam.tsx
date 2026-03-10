'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const images = [
  '/assets/les/lesHero.png',
  '/assets/les/lesHero.png',
  '/assets/les/lesHero.png',
  '/assets/les/lesHero.png',
  '/assets/les/lesHero.png',
  '/assets/les/lesHero.png',
]

export default function Guruvandhanam() {
  const [startIndex, setStartIndex] = useState(0)
  const visibleCount = 3

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(images.length - visibleCount, prev + 1))
  }

  const visibleImages = images.slice(startIndex, startIndex + visibleCount)

  return (
    <section className="py-16 bg-[#f5f3ee]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          {/* Left: Title + Description + Navigation */}
          <div className="space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a5632] italic">
              Guruvandhanam
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Honoring the legacy and dedication of our esteemed teachers and mentors who have shaped generations of Loyolites.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 hover:border-[#1a5632] hover:text-[#1a5632] transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                disabled={startIndex >= images.length - visibleCount}
                className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 hover:border-[#1a5632] hover:text-[#1a5632] transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Right: Image Gallery */}
          <div className="lg:col-span-2 grid grid-cols-3 gap-4">
            {visibleImages.map((img, index) => (
              <div
                key={startIndex + index}
                className="aspect-[4/3] relative rounded-xl overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`Guruvandhanam ${startIndex + index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
