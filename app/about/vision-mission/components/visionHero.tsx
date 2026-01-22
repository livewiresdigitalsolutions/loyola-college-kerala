import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function VisionHero() {
  return (
    <>
      {/* HERO SECTION WITH IMAGE AND GREEN OVERLAY */}
      <section className="relative w-full h-[600px] md:h-[700px]">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/loyola-building.png"
            alt="Vision & Mission"
            fill
            className="object-cover"
            priority
          />
          {/* GREEN GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/60"></div>
          {/* ADDITIONAL DARK OVERLAY FOR TEXT READABILITY */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-3xl">
              {/* BREADCRUMB NAVIGATION */}
              <nav className="flex items-center gap-2 text-white/90 mb-8 text-sm">
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/about-us" className="hover:text-white transition-colors">
                  About
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#F0B129] font-medium">Vision & Mission</span>
              </nav>

              {/* BADGE */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-sm tracking-wide">
                  OUR PURPOSE
                </span>
              </div>

              {/* MAIN HEADING */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Vision & Mission
              </h1>

              {/* SUBHEADING */}
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-light">
                Guiding principles that shape our commitment to excellence,
                social responsibility, and transformative education.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
