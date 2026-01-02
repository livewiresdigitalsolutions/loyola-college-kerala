'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronDown,
  Instagram,
  Youtube,
  Facebook,
  X,
  Menu,
  XIcon
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect((): (() => void) => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  const hideNavbarRoutes = ['/sys-ops'];
  const shouldHideNavbar = hideNavbarRoutes.some(route => 
    pathname?.startsWith(route)
  );

  if (shouldHideNavbar) {
    return null;
  }

  const menuData = {
    about: {
      title: 'About Us',
      sections: [
        {
          title: 'About the Institution',
          links: [
            { name: 'History', href: '/about/history' },
            { name: 'Vision & Mission', href: '/about/vision-mission' },
            { name: 'Administration', href: '/about/administration' },
            { name: 'Governing Body', href: '/about/governing-body' },
            { name: 'Academic Council', href: '/about/academic-council' }
          ]
        },
        {
          title: 'Associations & Identity',
          links: [
            { name: 'PTA', href: '/about/pta' },
            { name: 'RTI Declaration', href: '/about/rti-declaration' },
            { name: 'Institutional Distinctiveness', href: '/about/distinctiveness' }
          ]
        },
        {
          title: 'Highlights',
          links: [
            { name: 'Milestones & Galaxy of Eminence', href: '/about/milestones' },
            { name: 'Eminent Visitors', href: '/about/visitors' },
            { name: 'Programme Outcomes (POs)', href: '/about/outcomes' },
            { name: 'Who is Who', href: '/about/who-is-who' }
          ]
        }
      ]
    },
    academics: {
      title: 'Academics',
      sections: [
        {
          title: 'Programs',
          links: [
            { name: 'Departments', href: '/academics/departments' },
            { name: 'Programmes & Courses Offered', href: '/academics/courses' },
            { name: 'Certificate Courses', href: '/academics/certificates' },
            { name: 'ECE – Engaged Competence Enhancement', href: '/academics/ece' }
          ]
        },
        {
          title: 'Teaching & Learning',
          links: [
            { name: 'Faculty', href: '/academics/faculty' },
            { name: 'Innovation Centre', href: '/academics/innovation' },
            { name: 'Resources', href: '/academics/resources' }
          ]
        },
        {
          title: 'Academic Process',
          links: [
            { name: 'Academic Calendar', href: '/academics/calendar' },
            { name: 'Outcome Based Education Framework', href: '/academics/obe' },
            { name: 'Code of Conduct', href: '/academics/conduct' },
            { name: 'Committees', href: '/academics/committees' },
            { name: 'Examination Details', href: '/academics/exams' }
          ]
        }
      ]
    },
    campusLife: {
      title: 'Campus Life',
      sections: [
        {
          title: 'Learning Spaces',
          links: [
            { name: 'Library', href: '/campus/library' },
            { name: 'Loyola Computer Centre', href: '/campus/computer-centre' },
            { name: 'Journals', href: '/campus/journals' }
          ]
        },
        {
          title: 'Student Living',
          links: [
            { name: 'Hostels', href: '/campus/hostels' },
            { name: 'Cafeteria', href: '/campus/cafeteria' },
            { name: 'Transportation', href: '/campus/transportation' }
          ]
        },
        {
          title: 'Sports & Activities',
          links: [
            { name: 'Gymnasium', href: '/campus/gymnasium' }
          ]
        },
        {
          title: 'Halls & Venues',
          links: [
            { name: 'Audio-Visual Hall', href: '/campus/av-hall' },
            { name: 'Dr. Jose Murikkan\'s Hall', href: '/campus/murikkan-hall' },
            { name: 'LES Hall', href: '/campus/les-hall' }
          ]
        },
        {
          title: 'Services',
          links: [
            { name: 'Loyola Extension Services (LES)', href: '/campus/les' },
            { name: 'Other Facilities', href: '/campus/facilities' }
          ]
        }
      ]
    },
    studentEngagement: {
      title: 'Student Engagement',
      sections: [
        {
          title: 'Clubs & Forums',
          links: [
            { name: 'Student Associations', href: '/students/associations' },
            { name: 'LITCOF', href: '/students/litcof' },
            { name: 'LET', href: '/students/let' },
            { name: 'EM & Biodiversity', href: '/students/biodiversity' },
            { name: 'Women Cell', href: '/students/women-cell' }
          ]
        },
        {
          title: 'Development & Support',
          links: [
            { name: 'Student Progression', href: '/students/progression' },
            { name: 'LMP (Mentoring)', href: '/students/lmp' },
            { name: 'LACE (Career Enhancement)', href: '/students/lace' },
            { name: 'LILA (Language Advancement)', href: '/students/lila' }
          ]
        },
        {
          title: 'Leadership & Social',
          links: [
            { name: 'Loyola NSS Unit', href: '/students/nss' },
            { name: 'College Union', href: '/students/union' }
          ]
        },
        {
          title: 'Others',
          links: [
            { name: 'View All', href: '/students/all' }
          ]
        }
      ]
    },
    iqac: {
      title: 'IQAC',
      links: [
        { name: 'Autonomy', href: 'https://loyolacollegekerala.edu.in/iqac/autonomy/' },
        { name: 'NAAC', href: 'https://loyolacollegekerala.edu.in/iqac/' },
        { name: 'NIRF', href: 'https://loyolacollegekerala.edu.in/nirf/' },
        { name: 'AISHE', href: 'https://loyolacollegekerala.edu.in/#' },
        { name: 'SAAC', href: 'https://loyolacollegekerala.edu.in/#' },
        { name: 'Others', href: 'https://loyolacollegekerala.edu.in/#' }
      ]
    },
    placements: {
      title: 'Placements',
      links: [
        { name: 'Placement Cell', href: '/placements/cell' },
        { name: 'Placement Activities', href: '/placements/activities' },
        { name: 'Training & Skill Development', href: '/placements/training' },
        { name: 'Internship Opportunities', href: '/placements/internships' },
        { name: 'Recruiters / Partner Companies', href: '/placements/recruiters' },
        { name: 'Placement Statistics', href: '/placements/statistics' },
        { name: 'Alumni Success Stories', href: '/placements/alumni' },
        { name: 'Higher Studies Guidance', href: '/placements/higher-studies' },
        { name: 'Contact Placement Officer', href: '/placements/contact' }
      ]
    },
    newsEvents: {
      title: 'News & Events',
      links: [
        { name: 'News Highlights', href: '/news/highlights' },
        { name: 'Events Calendar', href: '/news/calendar' },
        { name: 'Event Reports', href: '/news/reports' },
        { name: 'Circulars & Notices', href: '/news/circulars' }
      ]
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        {/* Top bar */}
        <div
          className={`px-4 md:px-8 lg:px-20 text-white transition-colors duration-300 ${
            scrolled ? 'bg-[#342D87]' : 'bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-3 md:gap-4">
              <Link href="#" aria-label="Instagram">
                <Instagram size={20} className="md:w-6 md:h-6 hover:opacity-80 transition" />
              </Link>
              <Link href="#" aria-label="YouTube">
                <Youtube size={20} className="md:w-6 md:h-6 hover:opacity-80 transition" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Facebook size={20} className="md:w-6 md:h-6 hover:opacity-80 transition" />
              </Link>
              <Link href="#" aria-label="X (Twitter)">
                <X size={20} className="md:w-6 md:h-6 hover:opacity-80 transition" />
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-6">
              <div 
                className="relative flex items-center gap-1 cursor-pointer hover:opacity-80 transition"
                onMouseEnter={() => setActiveDropdown('topStudent')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                Student <ChevronDown size={14} />
                {activeDropdown === 'topStudent' && (
                  <div className="absolute top-full right-0 mt-2 bg-white text-black rounded-md shadow-lg py-2 min-w-[200px]">
                    <Link href="/student/portal" className="block px-4 py-2 hover:bg-gray-100">
                      Student Portal
                    </Link>
                    <Link href="/student/resources" className="block px-4 py-2 hover:bg-gray-100">
                      Student Resources
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/alumni" className="hover:opacity-80 transition">
                Alumni
              </Link>

              <div 
                className="relative flex items-center gap-1 cursor-pointer hover:opacity-80 transition"
                onMouseEnter={() => setActiveDropdown('topNews')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                News & Events <ChevronDown size={14} />
                {activeDropdown === 'topNews' && (
                  <div className="absolute top-full right-0 mt-2 bg-white text-black rounded-md shadow-lg py-2 min-w-[200px]">
                    {menuData.newsEvents.links.map((link, idx) => (
                      <Link key={idx} href={link.href} className="block px-4 py-2 hover:bg-gray-100">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/contact" className="hover:opacity-80 transition">
                Contact Us
              </Link>

              <input
                type="text"
                placeholder="Search..."
                className={`rounded-md px-3 py-1 text-sm outline-none transition ${
                  scrolled
                    ? 'bg-gray-100 text-black'
                    : 'bg-white/20 placeholder-white text-white'
                }`}
              />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XIcon size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>

          <div
            className={`h-[1px] w-full transition-colors duration-300 ${
              scrolled ? 'bg-[#342D87]' : 'bg-white'
            }`}
          />
        </div>

        {/* Main navbar */}
        <div
          className={`px-4 md:px-8 lg:px-20 transition-colors duration-300 ${
            scrolled ? 'text-[#342D87]' : 'text-white'
          }`}
        >
          <div className="flex items-center justify-between py-3">
            <Link href="/">
              <Image
                src={scrolled ? '/assets/loyoladarklogo.png' : '/assets/loyolalogo.png'}
                alt="Loyola College"
                width={140}
                height={50}
                className="md:w-40 md:h-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 font-medium">
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('about')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
                  About <ChevronDown size={14} />
                </div>
              </div>

              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('academics')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
                  Academics <ChevronDown size={14} />
                </div>
              </div>

              <Link href="/research" className="hover:opacity-80 transition">
                Research
              </Link>

              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('campusLife')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition whitespace-nowrap">
                  Campus Life <ChevronDown size={14} />
                </div>
              </div>

              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('studentEngagement')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition whitespace-nowrap">
                  Student Engagement <ChevronDown size={14} />
                </div>
              </div>

              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('iqac')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
                  IQAC <ChevronDown size={14} />
                </div>
              </div>

              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('placements')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
                  Placements <ChevronDown size={14} />
                </div>
              </div>

              <Link href="/gallery" className="hover:opacity-80 transition">
                Gallery
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Backdrop Overlay */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 bg-black/10 z-40 "
          style={{ top: scrolled ? '100px' : '100px' }}
          onMouseEnter={() => setActiveDropdown(null)}
        />
      )}

      {/* Mega Menu Dropdowns - Card Style */}
      {activeDropdown === 'about' && (
        <div 
          className="dropdown-container fixed left-0 right-0 z-40"
          style={{ top: scrolled ? '100px' : '100px' }}
          onMouseEnter={() => setActiveDropdown('about')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-8">
            <div className="dropdown-card bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#342D87] mb-6">About Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {menuData.about.sections.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="font-semibold text-[#342D87] text-base border-b border-gray-200 pb-2">
                      {section.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {section.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <Link 
                            href={link.href} 
                            className="text-sm text-gray-600 hover:text-[#342D87] hover:translate-x-2 transition-all duration-200 block"
                          >
                            → {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeDropdown === 'academics' && (
        <div 
          className="dropdown-container fixed left-0 right-0 z-40"
          style={{ top: scrolled ? '100px' : '100px' }}
          onMouseEnter={() => setActiveDropdown('academics')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-8">
            <div className="dropdown-card bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#342D87] mb-6">Academics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {menuData.academics.sections.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="font-semibold text-[#342D87] text-base border-b border-gray-200 pb-2">
                      {section.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {section.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <Link 
                            href={link.href} 
                            className="text-sm text-gray-600 hover:text-[#342D87] hover:translate-x-2 transition-all duration-200 block"
                          >
                            → {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeDropdown === 'campusLife' && (
        <div 
          className="dropdown-container fixed left-0 right-0 z-40"
          style={{ top: scrolled ? '100px' : '100px' }}
          onMouseEnter={() => setActiveDropdown('campusLife')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-8">
            <div className="dropdown-card bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#342D87] mb-6">Campus Life</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {menuData.campusLife.sections.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="font-semibold text-[#342D87] text-base border-b border-gray-200 pb-2">
                      {section.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {section.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <Link 
                            href={link.href} 
                            className="text-sm text-gray-600 hover:text-[#342D87] hover:translate-x-2 transition-all duration-200 block"
                          >
                            → {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeDropdown === 'studentEngagement' && (
        <div 
          className="dropdown-container fixed left-0 right-0 z-40"
          style={{ top: scrolled ? '100px' : '100px' }}
          onMouseEnter={() => setActiveDropdown('studentEngagement')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-8">
            <div className="dropdown-card bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#342D87] mb-6">Student Engagement</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {menuData.studentEngagement.sections.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="font-semibold text-[#342D87] text-base border-b border-gray-200 pb-2">
                      {section.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {section.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <Link 
                            href={link.href} 
                            className="text-sm text-gray-600 hover:text-[#342D87] hover:translate-x-2 transition-all duration-200 block"
                          >
                            → {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeDropdown === 'iqac' && (
        <div 
          className="dropdown-container fixed left-0 right-0 z-40"
          style={{ top: scrolled ? '100px' : '100px' }}
          onMouseEnter={() => setActiveDropdown('iqac')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-8">
            <div className="dropdown-card bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-[#342D87] mb-6">IQAC</h2>
              <ul className="grid grid-cols-2 gap-4">
                {menuData.iqac.links.map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-gray-600 hover:text-[#342D87] hover:translate-x-2 transition-all duration-200 block py-2"
                    >
                      → {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeDropdown === 'placements' && (
        <div 
          className="dropdown-container fixed left-0 right-0 z-40"
          style={{ top: scrolled ? '100px' : '100px' }}
          onMouseEnter={() => setActiveDropdown('placements')}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-8">
            <div className="dropdown-card bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-[#342D87] mb-6">Placements</h2>
              <ul className="grid grid-cols-2 gap-4">
                {menuData.placements.links.map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-gray-600 hover:text-[#342D87] hover:translate-x-2 transition-all duration-200 block py-2"
                    >
                      → {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      
      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="mb-6 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <XIcon size={24} className="text-gray-700" />
          </button>

          <nav className="space-y-4">
            <div>
              <button
                onClick={() => setMobileDropdown(mobileDropdown === 'about' ? null : 'about')}
                className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-[#342D87] transition"
              >
                About <ChevronDown size={16} className={`transform transition-transform ${mobileDropdown === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {mobileDropdown === 'about' && (
                <div className="mt-3 ml-4 space-y-3">
                  {menuData.about.sections.map((section, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold text-sm text-[#342D87] mb-2">{section.title}</h4>
                      <ul className="space-y-2">
                        {section.links.map((link, li) => (
                          <li key={li}>
                            <Link href={link.href} className="text-sm text-gray-600 hover:text-[#342D87] block">
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setMobileDropdown(mobileDropdown === 'academics' ? null : 'academics')}
                className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-[#342D87] transition"
              >
                Academics <ChevronDown size={16} className={`transform transition-transform ${mobileDropdown === 'academics' ? 'rotate-180' : ''}`} />
              </button>
              {mobileDropdown === 'academics' && (
                <div className="mt-3 ml-4 space-y-3">
                  {menuData.academics.sections.map((section, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold text-sm text-[#342D87] mb-2">{section.title}</h4>
                      <ul className="space-y-2">
                        {section.links.map((link, li) => (
                          <li key={li}>
                            <Link href={link.href} className="text-sm text-gray-600 hover:text-[#342D87] block">
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/research" className="block font-medium text-gray-900 hover:text-[#342D87] transition">
              Research
            </Link>

            <div>
              <button
                onClick={() => setMobileDropdown(mobileDropdown === 'campusLife' ? null : 'campusLife')}
                className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-[#342D87] transition"
              >
                Campus Life <ChevronDown size={16} className={`transform transition-transform ${mobileDropdown === 'campusLife' ? 'rotate-180' : ''}`} />
              </button>
              {mobileDropdown === 'campusLife' && (
                <div className="mt-3 ml-4 space-y-3">
                  {menuData.campusLife.sections.map((section, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold text-sm text-[#342D87] mb-2">{section.title}</h4>
                      <ul className="space-y-2">
                        {section.links.map((link, li) => (
                          <li key={li}>
                            <Link href={link.href} className="text-sm text-gray-600 hover:text-[#342D87] block">
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setMobileDropdown(mobileDropdown === 'studentEngagement' ? null : 'studentEngagement')}
                className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-[#342D87] transition"
              >
                Student Engagement <ChevronDown size={16} className={`transform transition-transform ${mobileDropdown === 'studentEngagement' ? 'rotate-180' : ''}`} />
              </button>
              {mobileDropdown === 'studentEngagement' && (
                <div className="mt-3 ml-4 space-y-3">
                  {menuData.studentEngagement.sections.map((section, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold text-sm text-[#342D87] mb-2">{section.title}</h4>
                      <ul className="space-y-2">
                        {section.links.map((link, li) => (
                          <li key={li}>
                            <Link href={link.href} className="text-sm text-gray-600 hover:text-[#342D87] block">
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setMobileDropdown(mobileDropdown === 'iqac' ? null : 'iqac')}
                className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-[#342D87] transition"
              >
                IQAC <ChevronDown size={16} className={`transform transition-transform ${mobileDropdown === 'iqac' ? 'rotate-180' : ''}`} />
              </button>
              {mobileDropdown === 'iqac' && (
                <div className="mt-3 ml-4">
                  <ul className="space-y-2">
                    {menuData.iqac.links.map((link, idx) => (
                      <li key={idx}>
                        <Link href={link.href} className="text-sm text-gray-600 hover:text-[#342D87] block">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setMobileDropdown(mobileDropdown === 'placements' ? null : 'placements')}
                className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-[#342D87] transition"
              >
                Placements <ChevronDown size={16} className={`transform transition-transform ${mobileDropdown === 'placements' ? 'rotate-180' : ''}`} />
              </button>
              {mobileDropdown === 'placements' && (
                <div className="mt-3 ml-4">
                  <ul className="space-y-2">
                    {menuData.placements.links.map((link, idx) => (
                      <li key={idx}>
                        <Link href={link.href} className="text-sm text-gray-600 hover:text-[#342D87] block">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link href="/gallery" className="block font-medium text-gray-900 hover:text-[#342D87] transition">
              Gallery
            </Link>

            <div className="pt-4 border-t">
              <Link href="/alumni" className="block py-2 text-gray-700 hover:text-[#342D87]">Alumni</Link>
              <Link href="/contact" className="block py-2 text-gray-700 hover:text-[#342D87]">Contact Us</Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Optimized CSS Animations */}
      <style jsx global>{`
        .dropdown-container {
          animation: dropdownSlide 0.25s ease-out forwards;
          will-change: opacity, transform;
        }

        .dropdown-card {
          animation: cardFadeIn 0.3s ease-out forwards;
          will-change: opacity, transform;
        }

        @keyframes dropdownSlide {
          0% {
            opacity: 0;
            transform: translateY(-15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Hardware acceleration for smooth animations */
        .dropdown-container,
        .dropdown-card {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* Prevent text overlap during animation */
        .dropdown-card h2,
        .dropdown-card h3,
        .dropdown-card ul {
          opacity: 0;
          animation: textFadeIn 0.3s ease-out 0.1s forwards;
        }

        @keyframes textFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
