'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  ChevronDown,
  Instagram,
  Youtube,
  Facebook,
  X
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect((): (() => void) => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hide navbar on sys-ops pages and all its subpages
  const hideNavbarRoutes = ['/sys-ops'];
  const shouldHideNavbar = hideNavbarRoutes.some(route => 
    pathname?.startsWith(route)
  );

  // Don't render navbar on sys-ops pages
  if (shouldHideNavbar) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      {/* Top bar */}
      <div
        className={`px-20 text-white transition-colors duration-300 ${
          scrolled ? 'bg-[#342D87]' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <Instagram size={25} />
            <Youtube size={25} />
            <Facebook size={25} />
            <X size={25} />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 cursor-pointer">
              Student <ChevronDown size={14} />
            </div>

            <span>Alumni</span>

            <div className="flex items-center gap-1 cursor-pointer">
              News & Events <ChevronDown size={14} />
            </div>

            <span>Contact Us</span>

            <input
              type="text"
              placeholder="Search..."
              className={`rounded-md px-3 py-1 text-sm outline-none transition ${
                scrolled
                  ? 'bg-gray-100 text-black'
                  : 'bg-white/20 placeholder-white text-white'
              }`}
            />

            <button className="flex items-center gap-1 rounded-md bg-[#342D87] px-4 py-1.5 text-white">
              Login <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Divider line */}
        <div
          className={`h-[1px] w-full transition-colors duration-300 ${
            scrolled ? 'bg-[#342D87]' : 'bg-white'
          }`}
        />
      </div>

      {/* Main navbar */}
      <div
        className={`px-20 transition-colors duration-300 ${
          scrolled ? 'text-[#342D87]' : 'text-white'
        }`}
      >
        <div className="flex items-center justify-between py-3">
          <Image
            src={scrolled ? '/assets/loyoladarklogo.png' : '/assets/loyolalogo.png'}
            alt="Loyola College"
            width={160}
            height={60}
            priority
          />

          <nav className="flex items-center gap-7 font-medium">
            <div className="flex items-center gap-1 cursor-pointer">
              About <ChevronDown size={14} />
            </div>

            <div className="flex items-center gap-1 cursor-pointer">
              Academics <ChevronDown size={14} />
            </div>

            <div className="flex items-center gap-1 cursor-pointer">
              Research <ChevronDown size={14} />
            </div>

            <div className="flex items-center gap-1 cursor-pointer">
              Campus Life <ChevronDown size={14} />
            </div>

            <div className="flex items-center gap-1 cursor-pointer">
              IQAC <ChevronDown size={14} />
            </div>

            <span>Placements</span>
            <span>Gallery</span>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
