import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/loyola-building.png"
          alt="Programmes and Courses"
          fill
          className="object-cover"
          priority
        />
        {/* GRADIENT OVERLAY */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(to right, var(--color-primary, #1a5632) 0%, rgba(26, 86, 50, 0.7) 50%, transparent 100%)' 
          }}
        ></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            {/* BREADCRUMB NAVIGATION */}
            <nav className="flex items-center gap-2 text-white/90 mb-8 text-sm flex-wrap">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/academics" className="hover:text-white transition-colors">
                Academics
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#F0B129] font-medium">Programmes & Courses Offered</span>
            </nav>

            {/* MAIN HEADING */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Academic Programmes
            </h1>

            {/* SUBTITLE */}
            <p className="text-lg md:text-xl text-white/90 mt-4 max-w-2xl">
              Discover our diverse range of undergraduate, postgraduate, and doctoral programmes designed to shape future leaders in social sciences.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
