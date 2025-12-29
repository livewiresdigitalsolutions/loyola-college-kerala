"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Send, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#1F2227] text-white overflow-hidden">
      {/* Diagonal overlay */}
      <div className="absolute inset-0 bg-[#2A2D32] clip-diagonal pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* BRAND */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <Image
                          src='/assets/loyolalogo.png'
                          alt="Loyola College"
                          width={160}
                          height={60}
                          priority
                        />
            </div>

            <p className="text-sm text-gray-300 max-w-sm">
              Education grounded in social responsibility, research, and
              community impact—shaping leaders for tomorrow.
            </p>

            <div className="grid grid-cols-2">
            <button className="mt-4 px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-yellow-500 transition-transform duration-300 hover:scale-105">
              Admissions 2026 →
            </button>
            
            </div>
          </div>

          {/* PRODUCT */}
          <FooterCol
            title="About Us"
            links={[
              "Our History",
              "Our Mission and Vision",
              "Teachers",
              "Events",
              "Who is Who",
            ]}
          />

          {/* RESOURCES */}
          <FooterCol
            title="Academics"
            links={[
              "Departments",
              "Programs Offered",
              "Certified Courses",
              "Research",
              "Faculty",
            ]}
          />

          {/* COMPANY */}
          <FooterCol
            title="Infrastructure"
            links={[
              "LES",
              "Journal",
              "Gymnasiuam",
              "Library",
            ]}
          />
        </div>

        {/* DIVIDER */}
        <div className="mt-14 border-t border-gray-600/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* LEFT */}
          <p className="text-sm text-gray-400">
            © 2025 Loyola. All Rights Reserved
          </p>

          {/* LINKS */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Use</Link>
            <Link href="#">Site Map</Link>
          </div>

          {/* SOCIALS */}
          <div className="flex items-center gap-4">
            <SocialIcon icon={<Facebook />} />
            <SocialIcon icon={<Twitter />} />
            <SocialIcon icon={<Instagram />} />
            <SocialIcon icon={<Send />} />
          </div>
        </div>
      </div>

      {/* CLIP PATH STYLE */}
      <style jsx>{`
        .clip-diagonal {
          clip-path: polygon(60% 0, 100% 0, 100% 100%, 35% 100%);
        }
      `}</style>
    </footer>
  );
}

/* ---------------- COMPONENTS ---------------- */

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm text-gray-300">
        {links.map((link, i) => (
          <li key={i}>
            <Link href="#" className="hover:text-white transition">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center hover:scale-105 transition cursor-pointer">
      {icon}
    </div>
  );
}
