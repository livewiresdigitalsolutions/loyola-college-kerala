"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AssociationData } from "../_data/associations";
import About from "../_components/About";
import OrganizingTeam from "../_components/OrganizingTeam";
import Activities from "../_components/Activities";
import Gallery from "../_components/Gallery";
import Contact from "../_components/Contact";

const navItems = [
  { id: "about", label: "About" },
  { id: "organizing-team", label: "Organizing Team" },
  { id: "activities", label: "Activities" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
];

export default function AssociationDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<AssociationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    fetch(`/api/associations/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((d) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  /* ── Scroll-spy: track which section is in view ── */
  useEffect(() => {
    if (!data) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0.1 }
    );

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [data]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <section className="relative bg-[var(--primary)] pt-36 pb-14 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 opacity-10 bg-[url('/assets/loyola-building.png')] bg-cover bg-center" />
          <div className="relative max-w-7xl mx-auto">
            <p className="text-[var(--secondary)] font-semibold text-sm tracking-wider uppercase mb-2">
              Student Association
            </p>
            <div className="h-12 w-96 bg-white/20 rounded animate-pulse" />
          </div>
        </section>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]" />
        </div>
      </main>
    );
  }

  if (error || !data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* ───── Hero Banner ───── */}
      <section className="relative bg-[var(--primary)] pt-36 pb-14 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url('${data.bg_image || '/assets/loyola-building.png'}')` }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center text-white/70 text-sm mb-5">
            <Link href="/" className="hover:text-white transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 inline -mt-0.5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
                />
              </svg>
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2" />
            <Link
              href="/students/students-associations"
              className="hover:text-white transition"
            >
              Student Associations
            </Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2" />
            <span className="text-[var(--secondary)] font-medium">
              {data.name}
            </span>
          </nav>

          <p className="text-[var(--secondary)] font-semibold text-sm tracking-wider uppercase mb-2">
            Student Association
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {data.full_name}
          </h1>
          <p className="mt-4 text-white/80 text-base max-w-2xl">
            {data.department} · Loyola College of Social Sciences,
            Thiruvananthapuram
          </p>
        </div>
      </section>

      {/* ───── Sticky Section Navbar ───── */}
      <nav className="sticky top-[0px] z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0">
            {navItems.map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`relative px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200
                    ${
                      isActive
                        ? "text-[var(--primary)]"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  {label}
                  {/* Active underline */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full bg-[var(--primary)] transition-all duration-300
                      ${isActive ? "w-8" : "w-0"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ───── Sections ───── */}
      <About data={data} />
      <OrganizingTeam data={data} />
      <Activities data={data} />
      <Gallery data={data} />
      <Contact data={data} />
    </main>
  );
}
