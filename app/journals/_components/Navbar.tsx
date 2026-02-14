"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, ArrowLeft, Search, Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/journals" },
  { label: "About Us", href: "/journals/about" },
  { label: "Editorial Board", href: "/journals/editorial-board" },
  { label: "Archives", href: "/journals/archives" },
  { label: "Online Subscription", href: "/journals/subscription" },
  { label: "Article Submission", href: "/journals/submission" },
];

export default function LesNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col font-sans">
      {/* Top Bar - Dark Green */}
      <div className="bg-primary text-white text-xs py-2 px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone size={14} className="opacity-80" />
            <span>+91 471 2591018</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="opacity-80" />
            <a
              href="mailto:loyolajournal1987@gmail.com"
              className="hover:underline"
            >
              loyolajournal1987@gmail.com
            </a>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Main Site</span>
          </Link>
          <div className="h-3 w-px bg-white/30"></div>
          <Link
            href="/contact"
            className="hover:text-white/80 transition-colors"
          >
            Contact Us
          </Link>
          <Link href="/login" className="hover:text-white/80 transition-colors">
            Login
          </Link>
        </div>
      </div>

      {/* Main Navbar - White */}
      <div className="bg-white shadow-sm border-b border-gray-100 py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/journals" className="flex-shrink-0">
            <Image
              src="/assets/loyolalogogreen.png"
              alt="Loyola College of Social Sciences"
              width={200}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-primary font-medium text-sm transition-colors border-b-2 border-transparent hover:border-primary pb-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Icon & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-primary hover:bg-primary hover:text-white transition-all duration-300">
              <Search size={18} />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute top-full left-0 right-0 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-primary font-medium p-2 rounded-md hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2"></div>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ArrowLeft size={16} />
              Back to Main Site
            </Link>
            <Link href="/contact" className="p-2 text-gray-600">
              Contact Us
            </Link>
            <Link href="/login" className="p-2 text-gray-600">
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
