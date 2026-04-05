"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Mail,
  Phone,
  GraduationCap,
  Award,
  Briefcase,
  BookOpen,
  Users,
  Presentation,
  ChevronRight,
  Calendar,
  Building2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProfileTab {
  id: string;
  label: string;
  icon: string;
  content: string;
}

interface FacultyProfile {
  id: number;
  name: string;
  designation: string;
  qualification: string | null;
  specialization: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  department: string | null;
  category: string | null;
  pen: string | null;
  date_of_joining: string | null;
  profile_data: {
    tabs?: ProfileTab[];
    academic_qualifications?: string[];
    domain_expertise?: string[];
  } | null;
}

// ─── Tab icon resolver ───────────────────────────────────────────────────────

function TabIcon({ name, className }: { name: string; className?: string }) {
  const props = { className: className || "w-4 h-4" };
  switch (name) {
    case "GraduationCap": return <GraduationCap {...props} />;
    case "BookOpen":      return <BookOpen {...props} />;
    case "Award":         return <Award {...props} />;
    case "Presentation":  return <Presentation {...props} />;
    case "Briefcase":     return <Briefcase {...props} />;
    case "Users":         return <Users {...props} />;
    default:              return <BookOpen {...props} />;
  }
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 animate-pulse">
      <section className="relative w-full h-[280px] md:h-[340px] bg-gray-300" />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10">
            <div className="-mt-[56px] shrink-0 w-56 h-56 rounded-2xl bg-gray-200 shadow-xl" />
            <div className="flex-1 pt-5 pb-8 space-y-3">
              <div className="h-8 bg-gray-200 rounded w-64" />
              <div className="h-4 bg-gray-200 rounded w-40" />
              <div className="h-4 bg-gray-200 rounded w-52" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function FacultyProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/academics/faculty/${id}`);
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) throw new Error("Failed to fetch");
        const data: FacultyProfile = await res.json();
        setProfile(data);

        // Set first tab as active
        const tabs = data.profile_data?.tabs;
        if (tabs && tabs.length > 0) {
          setActiveTab(tabs[0].id);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  if (loading) return <ProfileSkeleton />;

  if (notFound || !profile) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Faculty member not found</h1>
          <p className="text-gray-500 mb-6">This profile may have been removed or does not exist.</p>
          <Link href="/academics/faculty-and-staffs" className="text-primary underline hover:opacity-80">
            ← Back to Faculty & Staffs
          </Link>
        </div>
      </main>
    );
  }

  const tabs = profile.profile_data?.tabs || [];
  const academicQualifications = profile.profile_data?.academic_qualifications || 
    (profile.qualification ? profile.qualification.split(",").map(q => q.trim()) : []);
  const domainExpertise = profile.profile_data?.domain_expertise || 
    (profile.specialization ? profile.specialization.split(",").map(s => s.trim()) : []);
  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════════════════════
           HERO — background image + breadcrumb
         ══════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[280px] md:h-[340px]">
        <div className="absolute inset-0">
          <Image src="/assets/loyola-building.png" alt="Faculty" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/70 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 h-full flex items-center px-6 max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-white/80 text-sm flex-wrap">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span>Academics</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <Link href="/academics/faculty-and-staffs" className="hover:text-white transition-colors">Faculty &amp; Staffs</Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[#F0B129]">{profile.name}</span>
          </nav>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
           PROFILE IDENTITY STRIP
         ══════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10">

            {/* Photo */}
            <div className="-mt-[56px] shrink-0 relative z-10">
              <div className="w-56 h-56 rounded-2xl bg-white p-[5px] shadow-xl ring-4 ring-primary/20">
                <div className="relative w-full h-full rounded-[11px] overflow-hidden bg-gray-100">
                  <Image
                    src={profile.image || "/assets/defaultprofile.png"}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-5 pb-8 min-w-0">

              {/* Top row: name + PEN badge */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {profile.name}
                </h1>
                {profile.pen && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg shrink-0">
                    PEN: {profile.pen}
                  </span>
                )}
              </div>

              {/* Designation & Department */}
              <p className="text-primary font-semibold text-sm mt-1.5">{profile.designation}</p>
              {profile.department && (
                <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {profile.department}
                </p>
              )}

              {/* Divider */}
              <div className="border-t border-gray-100 mt-4 mb-3" />

              {/* Qualifications + Contact */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {academicQualifications.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
                    {academicQualifications.slice(0, 4).map((q, i) => (
                      <span key={i} className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md font-medium border border-gray-200">
                        {q}
                      </span>
                    ))}
                  </div>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium sm:ml-auto">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </a>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Content below ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 space-y-6">

        {/* ── Quick info strip ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Academic Qualifications */}
          {academicQualifications.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Academic Qualifications
                </h2>
              </div>
              <ul className="space-y-1.5">
                {academicQualifications.map((q, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Domain Expertise */}
          {domainExpertise.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Domain Expertise
                </h2>
              </div>
              <ul className="space-y-1.5">
                {domainExpertise.map((d, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Experience & Contact */}
          {(profile.date_of_joining || profile.phone || profile.email) && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Experience &amp; Contact
                </h2>
              </div>
              {profile.date_of_joining && (
                <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-medium text-gray-700">Joined:</span>
                  {profile.date_of_joining}
                </p>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`}
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  {profile.email}
                </a>
              )}
              {profile.phone && (
                <a href={`tel:${profile.phone}`}
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline mt-1">
                  <Phone className="w-3.5 h-3.5" />
                  {profile.phone}
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── Tabs ── */}
        {tabs.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Tab bar */}
            <div className="overflow-x-auto">
              <div className="flex border-b border-gray-100 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <TabIcon name={tab.icon} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            {currentTab && (
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <TabIcon name={currentTab.icon} className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {currentTab.label}
                  </h2>
                </div>
                <div
                  className="rich-content"
                  dangerouslySetInnerHTML={{ __html: currentTab.content }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Rich-content styles ── */}
      <style>{`
        .rich-content {
          color: #374151;
          font-size: 0.9375rem;
          line-height: 1.75;
        }
        .rich-content h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #0d4a33;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
          border-bottom: 2px solid #e5f0eb;
        }
        .rich-content h3:first-child { margin-top: 0; }
        .rich-content p { margin-bottom: 0.75rem; }
        .rich-content ul {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .rich-content ul li {
          position: relative;
          padding-left: 1.1rem;
          line-height: 1.7;
        }
        .rich-content ul li::before {
          content: "▸";
          color: #0d4a33;
          font-size: 0.7rem;
          position: absolute;
          left: 0;
          top: 0.28rem;
        }
        .rich-content ol {
          padding-left: 1.25rem;
          margin: 0 0 1rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .rich-content ol li { padding-left: 0.25rem; }
        .rich-content ol li::marker { color: #0d4a33; font-weight: 700; }
        .rich-content strong { color: #1f2937; font-weight: 700; }
        .rich-content em { font-style: italic; color: #4b5563; }
        .rich-content a { color: #0d4a33; text-decoration: underline; }
      `}</style>
    </main>
  );
}
