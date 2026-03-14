"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import { useAcademicYear } from "@/app/hooks/useAcademicYears";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const { academicYear, loading: yearLoading } = useAcademicYear();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const handleAdmissionsClick = () => {
    router.push("/#admissions");
  };

  return (
    <footer className="relative w-full bg-emerald-800 text-white overflow-hidden">
      {/* Diagonal overlay */}
      <div className="absolute inset-0 bg-primary clip-diagonal pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* BRAND */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/loyolalogo.png"
                alt="Loyola College"
                width={160}
                height={60}
                priority
              />
            </div>

            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              A premier institution for social sciences in Kerala, affiliated to the University of Kerala. Nurturing minds, shaping communities, and committed to academic excellence since 1963.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <SocialIcon icon={<Facebook className="w-4 h-4" />} href="#" />
              <SocialIcon icon={<Twitter className="w-4 h-4" />} href="#" />
              <SocialIcon icon={<Instagram className="w-4 h-4" />} href="#" />
              <SocialIcon icon={<Linkedin className="w-4 h-4" />} href="#" />
            </div>
          </div>

          {/* EXPLORE */}
          <div className="md:col-span-2">
            <FooterCol
              title="Explore"
              links={[
                { label: "About Us", href: "/about-us" },
                { label: "Academics", href: "/academics" },
                { label: "Admissions", href: "/admissions" },
                { label: "Research", href: "/research" },
                { label: "Campus Life", href: "/campus-life" },
                { label: "Alumni Network", href: "/alumni" },
              ]}
            />
          </div>

          {/* IMPORTANT LINKS */}
          <div className="md:col-span-3">
            <FooterCol
              title="Important Links"
              links={[
                { label: "IQAC / NAAC", href: "/iqac" },
                { label: "Extension Services (LES)", href: "/les" },
                { label: "Code of Conduct", href: "/code-of-conduct" },
                { label: "Academic Calendar", href: "/academic-calendar" },
                { label: "Student Associations", href: "/associations" },
              ]}
            />
            <Link 
              href="/careers" 
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#122e22] text-gray-200 border border-[#1b4332] rounded-md text-sm hover:bg-[#1b4332] transition"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              We're Hiring!
            </Link>
          </div>

          {/* CONTACT US */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
            
            <div className="flex items-start gap-4 text-sm text-gray-300">
              <div className="w-8 h-8 rounded-full bg-[#122e22] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="leading-relaxed">
                Loyola College of Social Sciences<br />
                Sreekariyam P.O.,<br />
                Thiruvananthapuram - 695017<br />
                Kerala, India
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-300 py-2">
              <div className="w-8 h-8 rounded-full bg-[#122e22] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-emerald-500" />
              </div>
              <p>+91 471 2591018</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="w-8 h-8 rounded-full bg-[#122e22] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-emerald-500" />
              </div>
              <p>loyolacollege.tvm@gmail.com</p>
            </div>
          </div>
        </div>

        {/* DIVIDER & BOTTOM BAR */}
        <div className="mt-16 border-t border-gray-700/50 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-400">
            © 2026 Loyola College of Social Sciences. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6 lg:gap-8 text-xs font-medium text-gray-400 uppercase tracking-wider">
            <Link href="/mandatory-disclosures" className="hover:text-white transition">
              MANDATORY DISCLOSURES
            </Link>
            <Link href="/anti-ragging" className="hover:text-white transition">
              ANTI-RAGGING
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition">
              PRIVACY POLICY
            </Link>
            <Link href="/terms-of-use" className="hover:text-white transition">
              TERMS OF USE
            </Link>
          </div>
        </div>
      </div>

      {/* CLIP PATH STYLE */}
      <style jsx>{`
        .clip-diagonal {
          clip-path: polygon(60% 0, 100% 0, 100% 100%, 35% 100%);
        }
        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.10);
          }
        }

        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
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
  links: { label: string; href: string }[];
}) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm text-gray-300">
        {links.map((link, i) => (
          <li key={i}>
            <Link href={link.href} className="hover:text-white transition">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded bg-white text-black flex items-center justify-center hover:scale-105 hover:bg-yellow-500 transition cursor-pointer"
    >
      {icon}
    </a>
  );
}
