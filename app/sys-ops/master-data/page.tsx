// app/sys-ops/master-data/page.tsx
"use client";

import {
  Database,
  GraduationCap,
  BookOpen,
  MapPin,
  School,
  ImageIcon,
  CalendarCog,
  HeartHandshake,
  BookMarked,
  Users,
} from "lucide-react";
import Link from "next/link";

interface MasterDataCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  bgColor: string;
}

const masterDataCards: MasterDataCard[] = [
  {
    id: "programs",
    title: "Programs",
    description: "Manage program levels and disciplines",
    icon: <School className="w-8 h-8" />,
    href: "/sys-ops/master-data/programs",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "degrees",
    title: "Degrees",
    description: "Manage degree names and program associations",
    icon: <GraduationCap className="w-8 h-8" />,
    href: "/sys-ops/master-data/degrees",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "courses",
    title: "Courses",
    description: "Manage courses and degree associations",
    icon: <BookOpen className="w-8 h-8" />,
    href: "/sys-ops/master-data/courses",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "exam-centers",
    title: "Exam Centers",
    description: "Manage exam center locations",
    icon: <MapPin className="w-8 h-8" />,
    href: "/sys-ops/master-data/exam-centers",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "hero-media",
    title: "Landing Page",
    description: "Manage hero section images and videos",
    icon: <ImageIcon className="w-8 h-8" />,
    href: "/sys-ops/master-data/hero-media",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "academic-years",
    title: "Academic Year",
    description: "Manage academic year",
    icon: <CalendarCog className="w-8 h-8" />,
    href: "/sys-ops/master-data/configuration",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "les",
    title: "LES",
    description: "Manage Loyola Extension Service data",
    icon: <HeartHandshake className="w-8 h-8" />,
    href: "/sys-ops/master-data/les",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "IQAC Media",
    title: "IQAC Media",
    description: "Manage IQAC media content",
    icon: <CalendarCog className="w-8 h-8" />,
    href: "/sys-ops/master-data/iqac-media",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "academics",
    title: "Academics",
    description: "Manage committees, faculty, calendar & departments",
    icon: <GraduationCap className="w-8 h-8" />,
    href: "/sys-ops/master-data/academics",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "journals",
    title: "Journals",
    description: "Manage journal board members, issues & contacts",
    icon: <BookMarked className="w-8 h-8" />,
    href: "/sys-ops/master-data/journals",
    color: "text-white",
    bgColor: "bg-primary",
  },

];

export default function MasterData() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Master Data Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage website configuration and reference data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {masterDataCards.map((card) => (
          <Link key={card.id} href={card.href}>
            <div className="bg-white rounded-xl shadow-xl border border-primary p-6 h-50 hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
              <div
                className={`${card.bgColor} ${card.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {card.title}
              </h3>
              <p className="text-primary text-sm">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
