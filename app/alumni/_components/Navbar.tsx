'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Menu, X, Phone, Mail, UserCircle, LogOut } from 'lucide-react'
import LoginModal from './LoginModal'
import { useAlumniAuth } from './AlumniAuthContext'

interface NavItem {
  label: string
  href: string
  hasDropdown?: boolean
  dropdownItems?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/alumni/home' },
  {
    label: 'About Us',
    href: '/alumni/about',
    hasDropdown: true,
    dropdownItems: [
      { label: 'The Legacy', href: '/alumni/about/legacy' },
      { label: 'Alumni Presidents', href: '/alumni/about/leadership' },
      { label: 'Office Bearers', href: '/alumni/about/office-bearers' },
    ]
  },
  {
    label: 'Activities',
    href: '/alumni/activities',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Mentoring', href: '/alumni/activities/mentoring' },
      { label: 'Awards & Scholarships', href: '/alumni/activities/awards' },
      { label: 'Events & Seminars', href: '/alumni/activities/events' },
    ]
  },
  { label: 'Gallery', href: '/alumni/gallery' },
  { label: 'Contact Us', href: '/alumni/contact' },
]

export default function AlumniNavbar() {
  const { user, logout } = useAlumniAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
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
    <>
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* TOP UTILITY BAR — always visible */}
      <div className="bg-[#0d3d2b] text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between py-2 text-xs md:text-sm">
              {/* Left: Contact Info */}
              <div className="flex items-center gap-4 md:gap-6">
                <a href="tel:+914712539016" className="flex items-center gap-1.5 hover:text-[#F0B129] transition-colors">
                  <Phone size={12} />
                  <span>+91-471-2539016</span>
                </a>
                <a href="mailto:info@loyalacollegekerala.edu.in" className="hidden sm:flex items-center gap-1.5 hover:text-[#F0B129] transition-colors">
                  <Mail size={12} />
                  <span>info@loyalacollegekerala.edu.in</span>
                </a>
              </div>

              {/* Right: Back to Main Site + Login */}
              <div className="flex items-center gap-4 md:gap-6">
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-[#F0B129] transition-colors font-medium"
                >
                  ← Back to Main Site
                </Link>
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-white/90">
                      <UserCircle size={16} className="text-[#F0B129]" />
                      <span>Hi, {user.name.split(' ')[0]}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="flex items-center gap-1 bg-white/10 hover:bg-red-500/30 px-3 py-1 rounded text-xs font-semibold transition-all"
                    >
                      <LogOut size={12} /> Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-xs font-semibold transition-all"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* MAIN NAVIGATION BAR */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/alumni/home" className="flex-shrink-0">
              <Image
                src={scrolled ? '/assets/loyolalogogreen.png' : '/assets/loyolalogo.png'}
                alt="Loyola College"
                width={180}
                height={50}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Navigation Links - Desktop (Right) */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.hasDropdown ? (
                    <button
                      className={`flex items-center gap-1 text-sm font-semibold transition whitespace-nowrap ${
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
                      className={`text-sm font-semibold transition whitespace-nowrap ${
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
            <nav className="lg:hidden py-4 border-t border-gray-100 bg-white rounded-b-lg shadow-lg">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        className="flex items-center justify-between w-full py-3 px-4 text-sm font-medium text-gray-700 hover:text-[#1a5632] hover:bg-gray-50 transition"
                        onClick={() => setMobileDropdown(mobileDropdown === item.label ? null : item.label)}
                      >
                        {item.label}
                        <ChevronDown size={14} className={`transition-transform ${mobileDropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileDropdown === item.label && item.dropdownItems?.map((dropItem) => (
                        <Link
                          key={dropItem.label}
                          href={dropItem.href}
                          className="block py-2 pl-8 pr-4 text-sm text-gray-600 hover:text-[#1a5632] hover:bg-gray-50 transition"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {dropItem.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-3 px-4 text-sm font-medium text-gray-700 hover:text-[#1a5632] hover:bg-gray-50 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile: Back to Main + Login */}
              <div className="border-t border-gray-100 mt-2 pt-2 px-4 space-y-2">
                <Link
                  href="/"
                  className="block py-2 text-sm font-medium text-[#1a5632] hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ← Back to Main Site
                </Link>
                <Link
                  href="/alumni/login"
                  className="block py-2 px-4 text-sm font-semibold text-center bg-[#1a5632] text-white rounded hover:bg-[#154a2b] transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
