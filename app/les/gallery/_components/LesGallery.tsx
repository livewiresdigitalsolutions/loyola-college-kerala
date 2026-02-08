'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { galleryImages } from '../../_data'

export default function LesGallery() {
  return (
    <section className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1a5632]">Gallery</h2>
        <Link 
          href="#" 
          className="text-[#1a5632] text-sm font-medium flex items-center gap-1 hover:underline"
        >
          View on Main Site
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryImages.map((image) => (
          <div 
            key={image.id}
            className="relative aspect-square overflow-hidden group cursor-pointer"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          </div>
        ))}
      </div>
    </section>
  )
}