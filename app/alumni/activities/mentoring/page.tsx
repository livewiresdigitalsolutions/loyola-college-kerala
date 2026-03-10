'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import HeroSection from '@/app/components/HeroSection'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Will load images from /assets/alumni/lacompasscarousel/
// Files should be named img1.jpg, img2.jpg, img3.jpg, etc.
const carouselImages = [
  '/assets/alumni/lacompasscarousel/img1.png',
  '/assets/alumni/lacompasscarousel/img2.png',
]

export default function Mentoring() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  return (
    <>
      <HeroSection
        title="Mentoring"
        smallTitle="LOYOLA COLLEGE ALUMNI ASSOCIATION"
        backgroundImage="/assets/alumni/herobg.jpg"
        breadcrumbs={[
          { label: 'Activities' },
          { label: 'Mentoring', highlight: true },
        ]}
        height="h-[400px] md:h-[450px] lg:h-[500px]"
      />

      {/* La Compass Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">La Compass</h2>
            <p className="text-gray-400 text-sm mt-1">Posted on: 2021-07-23 10:09:02</p>
          </div>

          {/* Image Carousel */}
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 group">
            {carouselImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={img}
                  alt={`La Compass ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-white scale-110'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
