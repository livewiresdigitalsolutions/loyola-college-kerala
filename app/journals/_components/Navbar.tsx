"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Phone, Mail, ArrowLeft, Search, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useJournalAuth } from "./AuthContext";
import AuthModal from "./AuthModal";

const navItems = [
  { label: "Home", href: "/journals" },
  { label: "About Us", href: "/journals/about" },
  { label: "Editorial Board", href: "/journals/editorial-board" },
  { label: "Archives", href: "/journals/archives" },
  { label: "Online Subscription", href: "/journals/subscription" },
  { label: "Article Submission", href: "/journals/article-submission" },
];

export default function LesNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useJournalAuth();

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push("/journals");
  };

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab="login" />

      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col font-sans">
        {/* Top Bar - Dark Green */}
        <div className="bg-primary text-white text-sm py-3 px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone size={14} className="opacity-80" />
              <span>+91 471 2591018</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="opacity-80" />
              <a href="mailto:loyolajournal1987@gmail.com" className="hover:underline">
                loyolajournal1987@gmail.com
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="flex items-center gap-1 hover:text-white/80 transition-colors">
              <ArrowLeft size={14} />
              <span>Back to Main Site</span>
            </Link>
            <div className="h-3 w-px bg-white/30"></div>
            <Link href="/contact" className="hover:text-white/80 transition-colors">
              Contact Us
            </Link>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 hover:text-white/80 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={12} />
                  </div>
                  <span>{user?.first_name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                    <Link
                      href="/journals/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard size={16} className="text-gray-400" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="hover:text-white/80 transition-colors cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Main Navbar - White */}
        <div className="bg-white shadow-sm border-b border-gray-100 py-3 px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link href="/journals" className="shrink-0">
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
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-sm font-medium transition-colors border-b-2 pb-1 ${
                      isActive
                        ? "text-primary border-primary"
                        : "text-muted-foreground border-transparent hover:text-primary hover:border-primary/50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Search Icon & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <button className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Search size={18} />
              </button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-foreground"
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
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block p-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-muted"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="h-px bg-border my-2"></div>
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground p-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ArrowLeft size={16} />
                Back to Main Site
              </Link>
              <Link
                href="/contact"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/journals/dashboard"
                    className="p-2 text-primary font-medium hover:bg-primary/10 rounded-md transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2 text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-primary font-medium hover:bg-primary/10 rounded-md transition-colors text-left"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
