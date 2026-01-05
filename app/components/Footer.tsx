"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Send, Megaphone } from "lucide-react";
import { useAcademicYear } from "@/app/hooks/useAcademicYears";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const { academicYear, loading: yearLoading } = useAcademicYear();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const handleAdmissionsClick = () => {
    // Navigate to the home page with the form visible
    router.push("/#admissions");
  };

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
                src="/assets/loyolalogo.png"
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
              {yearLoading ? (
                <button
                  disabled
                  className="mt-4 px-6 py-3 bg-gray-400 text-gray-600 font-black rounded-xl cursor-not-allowed"
                >
                  Loading...
                </button>
              ) : academicYear && academicYear.isOpen ? (
                <button
                  onClick={handleAdmissionsClick}
                  className="mt-4 px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-yellow-500 transition-transform duration-300 hover:scale-105"
                >
                  Admissions {academicYear.start} →
                </button>
              ) : (
                <button
                  disabled
                  className="mt-4 px-6 py-3 bg-gray-400 text-gray-600 font-black rounded-xl cursor-not-allowed"
                >
                  Admissions Coming Soon
                </button>
              )}
            </div>

            {/* Optional: Display current academic year info */}
            {academicYear && academicYear.isOpen && !yearLoading && (
              <div className="mt-3 p-3 bg-[#342D87] rounded-lg max-w-58 animate-breathe">
                <p className="text-xs text-gray-200">
                  Now accepting applications for
                </p>
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <Megaphone size={16} className="animate-pulse" />
                  Academic Year {academicYear.start}-
                  {parseInt(academicYear.start) + 1}
                </p>
              </div>
            )}
          </div>

          {/* PRODUCT */}
          <FooterCol
            title="About Us"
            links={[
              { label: "Our History", href: "/about/history" },
              { label: "Our Mission and Vision", href: "/about/mission" },
              { label: "Teachers", href: "/about/teachers" },
              { label: "Events", href: "/events" },
              { label: "Who is Who", href: "/about/who-is-who" },
            ]}
          />

          {/* RESOURCES */}
          <FooterCol
            title="Academics"
            links={[
              { label: "Departments", href: "/academics/departments" },
              { label: "Programs Offered", href: "/academics/programs" },
              { label: "Certified Courses", href: "/academics/courses" },
              { label: "Research", href: "/academics/research" },
              { label: "Faculty", href: "/academics/faculty" },
            ]}
          />

          {/* COMPANY */}
          <FooterCol
            title="Infrastructure"
            links={[
              { label: "LES", href: "/infrastructure/les" },
              { label: "Journal", href: "/infrastructure/journal" },
              { label: "Gymnasium", href: "/infrastructure/gymnasium" },
              { label: "Library", href: "/infrastructure/library" },
            ]}
          />
        </div>

        {/* DIVIDER */}
        <div className="mt-14 border-t border-gray-600/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* LEFT */}
          <p className="text-sm text-gray-400">
            © 2025 Loyola College Kerala. All Rights Reserved
            {academicYear && (
              <span className="ml-2 text-gray-500">
                | Academic Year {academicYear.start}-
                {parseInt(academicYear.start) + 1}
              </span>
            )}
          </p>

          {/* LINKS */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms of Use
            </Link>
            <Link href="/sitemap" className="hover:text-white transition">
              Site Map
            </Link>
          </div>

          {/* SOCIALS */}
          <div className="flex items-center gap-4">
            <SocialIcon
              icon={<Facebook className="w-4 h-4" />}
              href="https://facebook.com/loyolacollege"
            />
            <SocialIcon
              icon={<Twitter className="w-4 h-4" />}
              href="https://twitter.com/loyolacollege"
            />
            <SocialIcon
              icon={<Instagram className="w-4 h-4" />}
              href="https://instagram.com/loyolacollege"
            />
            <SocialIcon
              icon={<Send className="w-4 h-4" />}
              href="https://t.me/loyolacollege"
            />
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
