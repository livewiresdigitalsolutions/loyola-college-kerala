'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  hasDropdown?: boolean
  dropdownItems?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/les/home' },
  { label: 'About Us', href: '/les/about' },
  { 
    label: 'Engagements', 
    href: '/les/engagements',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Childline', href: '/les/engagements/childline' },
      { label: 'KECRO', href: '/les/engagements/kecro' },
      { label: 'Family Counselling Centre', href: '/les/engagements/familyCounsellingCentre' },
    ]
  },
  { label: 'Counselling Appointment', href: '/les/counsellingAppointment' },
  { label: 'Gallery', href: '/les/gallery' },
  { label: 'Our Team', href: '/les/team' },
  { label: 'Contact Us', href: '/les/contact' },
]

export default function LesNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current)
      dropdownTimeout.current = null
    }
    setActiveDropdown(label)
  }

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 300)
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Single line: Logo + Nav + Back Button */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/les/home" className="flex-shrink-0">
            <Image
              src={scrolled ? "/assets/loyolalogogreen.png" : "/assets/loyolalogo.png"}
              alt="Loyola College"
              width={180}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Navigation Links - Desktop (Center) */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navItems.map((item) => (
              <div 
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                {item.hasDropdown ? (
                  <button 
                    className={`flex items-center gap-1 text-sm font-medium transition whitespace-nowrap ${
                      scrolled 
                        ? 'text-gray-700 hover:text-[#1a5632]' 
                        : 'text-white hover:text-white/80'
                    }`}
                    onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link 
                    href={item.href}
                    className={`flex items-center gap-1 text-sm font-medium transition whitespace-nowrap ${
                      scrolled 
                        ? 'text-gray-700 hover:text-[#1a5632]' 
                        : 'text-white hover:text-white/80'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item.hasDropdown && activeDropdown === item.label && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-56 bg-white shadow-lg rounded-md border border-gray-100 py-2 z-50"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.dropdownItems?.map((dropItem) => (
                      <Link
                        key={dropItem.label}
                        href={dropItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1a5632] transition"
                      >
                        {dropItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          {/* Back to Main Site Button (Right) */}
          <Link 
            href="/"
            className={`hidden lg:flex items-center gap-2 px-4 py-2 border rounded text-sm font-medium transition flex-shrink-0 ${
              scrolled 
                ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                : 'border-white/50 text-white hover:bg-white/10'
            }`}
          >
            Back to Main Site
          </Link>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2 ${scrolled ? 'text-gray-700' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-100 bg-white">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.hasDropdown ? (
                  <>
                    <button
                      className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-700 hover:text-[#1a5632] transition"
                      onClick={() => setMobileDropdown(mobileDropdown === item.label ? null : item.label)}
                    >
                      {item.label}
                      <ChevronDown size={14} className={`transition-transform ${mobileDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileDropdown === item.label && item.dropdownItems?.map((dropItem) => (
                      <Link
                        key={dropItem.label}
                        href={dropItem.href}
                        className="block py-2 pl-4 text-sm text-gray-600 hover:text-[#1a5632] transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {dropItem.label}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link 
                    href={item.href}
                    className="block py-2 text-sm font-medium text-gray-700 hover:text-[#1a5632] transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link 
              href="/"
              className="block mt-4 py-2 text-sm font-medium text-[#1a5632] hover:underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              ← Back to Main Site
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

