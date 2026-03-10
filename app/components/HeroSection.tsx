import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string;
  href?: string;
  highlight?: boolean;
}

interface CTAButton {
  label: string;
  href: string;
  variant: 'primary' | 'outline';
}

interface NewsTicker {
  text: string;
  href?: string;
}

interface HeroSectionProps {
  title: string;
  smallTitle?: string;
  subtitle?: string;
  backgroundImage: string;
  breadcrumbs?: BreadcrumbItem[];
  ctaButtons?: CTAButton[];
  newsTicker?: NewsTicker;
  overlayColor?: string;
  height?: string;
}

export default function HeroSection({
  title,
  smallTitle,
  subtitle,
  backgroundImage,
  breadcrumbs,
  ctaButtons,
  newsTicker,
  overlayColor = '#1a5632',
  height = 'h-[500px] md:h-[600px] lg:h-[700px]',
}: HeroSectionProps) {
  return (
    <section className={`relative w-full ${height}`}>
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        {/* GRADIENT OVERLAY */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${overlayColor} 0%, ${overlayColor}b3 50%, transparent 100%)`,
          }}
        />
        {/* ADDITIONAL DARK OVERLAY FOR TEXT READABILITY */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            {/* BREADCRUMB NAVIGATION */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-2 text-white/90 mb-6 text-sm flex-wrap">
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Home
                </Link>
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    <ChevronRight className="w-4 h-4" />
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`hover:text-white transition-colors ${
                          item.highlight ? 'text-[#F0B129] font-medium' : ''
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-[#F0B129] font-medium">{item.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}

            {/* SMALL TITLE / TAGLINE */}
            {smallTitle && (
              <p className="text-sm md:text-base tracking-[0.2em] uppercase text-white/80 mb-4 font-medium">
                {smallTitle}
              </p>
            )}

            {/* MAIN HEADING */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {title}
            </h1>

            {/* SUBTITLE (OPTIONAL) */}
            {subtitle && (
              <p className="text-base md:text-lg text-white/90 mt-4 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* CTA BUTTONS */}
            {ctaButtons && ctaButtons.length > 0 && (
              <div className="flex flex-wrap gap-5 mt-10">
                {ctaButtons.map((btn, index) => (
                  <Link
                    key={index}
                    href={btn.href}
                    className={`px-8 py-3.5 rounded-lg text-base font-semibold transition-all duration-300 ${
                      btn.variant === 'primary'
                        ? 'bg-white text-[#1a5632] hover:bg-gray-100 shadow-lg'
                        : 'border-2 border-white/70 text-white hover:bg-white/10 hover:border-white'
                    }`}
                  >
                    {btn.label}
                  </Link>
                ))}
              </div>
            )}

            {/* NEWS TICKER LINK */}
            {newsTicker && (
              <div className="mt-8">
                {newsTicker.href ? (
                  <Link
                    href={newsTicker.href}
                    className="text-[#F0B129] text-sm font-medium hover:text-[#f5c452] transition-colors inline-flex items-center gap-2 underline underline-offset-2 decoration-[#F0B129]/50"
                  >
                    {newsTicker.text}
                    <span className="text-[#F0B129]">→</span>
                  </Link>
                ) : (
                  <p className="text-[#F0B129] text-sm font-medium inline-flex items-center gap-2 underline underline-offset-2 decoration-[#F0B129]/50">
                    {newsTicker.text}
                    <span>→</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  )
}
