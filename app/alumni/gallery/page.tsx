'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import HeroSection from '@/app/components/HeroSection'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

// Replace these with actual alumni gallery images in /assets/alumni/gallery/
const galleryImages = [
  { src: '/assets/alumni/herobg.jpg', alt: 'Alumni Event 1' },
  { src: '/assets/alumni/herobg.jpg', alt: 'Alumni Event 2' },
  { src: '/assets/alumni/herobg.jpg', alt: 'Alumni Event 3' },
  { src: '/assets/alumni/herobg.jpg', alt: 'Alumni Event 4' },
  { src: '/assets/alumni/herobg.jpg', alt: 'Alumni Event 5' },
  { src: '/assets/alumni/herobg.jpg', alt: 'Alumni Event 6' },
  { src: '/assets/alumni/herobg.jpg', alt: 'Alumni Event 7' },
  { src: '/assets/alumni/herobg.jpg', alt: 'Alumni Event 8' },
]

export default function AlumniGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length)
    }
  }

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % galleryImages.length)
    }
  }

  return (
    <>
      <HeroSection
        title="Gallery"
        smallTitle="LOYOLA COLLEGE ALUMNI ASSOCIATION"
        backgroundImage="/assets/alumni/herobg.jpg"
        breadcrumbs={[
          { label: 'Gallery', highlight: true },
        ]}
        height="h-[400px] md:h-[450px] lg:h-[500px]"
      />

      {/* Gallery Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square relative overflow-hidden bg-gray-100 cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition"
          >
            <X size={32} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="relative w-[80vw] h-[80vh]">
            <Image
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
          >
            <ChevronRight size={24} />
          </button>

          <p className="absolute bottom-6 text-white text-sm">
            {lightboxIndex + 1} / {galleryImages.length}
          </p>
        </div>
      )}
    </>
  )
}
