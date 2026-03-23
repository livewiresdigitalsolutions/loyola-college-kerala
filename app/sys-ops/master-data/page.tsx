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
  Award,
  UserCheck,
  Heart,
  FileText,
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
  // {
  //   id: "IQAC Media",
  //   title: "IQAC Media",
  //   description: "Manage IQAC media content",
  //   icon: <CalendarCog className="w-8 h-8" />,
  //   href: "/sys-ops/master-data/iqac-media",
  //   color: "text-white",
  //   bgColor: "bg-primary",
  // },
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
  // {
  //   id: "students-progression",
  //   title: "Student Progression",
  //   description: "Manage rank holders, qualifiers, placements & initiatives",
  //   icon: <GraduationCap className="w-8 h-8" />,
  //   href: "/sys-ops/master-data/students-progression",
  //   color: "text-white",
  //   bgColor: "bg-primary",
  // },
  {
    id: "iqac-naac",
    title: "IQAC",
    description: "Manage accreditation history, certificates, peer visits & clippings",
    icon: <Award className="w-8 h-8" />,
    href: "/sys-ops/master-data/iqac",
    color: "text-white",
    bgColor: "bg-primary",
  },
  // {
  //   id: "litcof-management",
  //   title: "LITCOF Management",
  //   description: "Manage LITCOF organizing team, activities, achievements, events & gallery",
  //   icon: <UserCheck className="w-8 h-8" />,
  //   href: "/sys-ops/master-data/Students-engagements/loyola-in-the-company-of-friends",
  //   color: "text-white",
  //   bgColor: "bg-primary",
  // },
  {
    id: "Students-Engagements",
    title: "Students Engagements",
    description: "Manage Students Engagements",
    icon: <UserCheck className="w-8 h-8" />,
    href: "/sys-ops/master-data/Students-engagements",
    color: "text-white",
    bgColor: "bg-primary",
  },
  // {
  //   id: "loyola-mentoring-programme",
  //   title: "Mentoring Programme",
  //   description: "Manage LMP organizing team and mentoring session records",
  //   icon: <Heart className="w-8 h-8" />,
  //   href: "/sys-ops/master-data/Students-engagements/loyola-mentoring-programme",
  //   color: "text-white",
  //   bgColor: "bg-primary",
  // },
  // {
  //   id: "loyola-ethnic-theatre",
  //   title: "Loyola Ethnic Theatre",
  //   description: "Manage Loyola Ethnic Theatre organizing team and activities",
  //   icon: <Heart className="w-8 h-8" />,
  //   href: "/sys-ops/master-data/Students-engagements/loyola-ethnic-theatre",
  //   color: "text-white",
  //   bgColor: "bg-primary",
  // },
  // {
  //   id: "loyola-academy-for-career-enhancement",
  //   title: "Loyola Academy for Career Enhancement",
  //   description: "Manage LACE organizing team and activities",
  //   icon: <Heart className="w-8 h-8" />,
  //   href: "/sys-ops/master-data/Students-engagements/loyola-academy-for-career-enhancement",
  //   color: "text-white",
  //   bgColor: "bg-primary",
  // },
  // {
  //   id: "loyola-initiative-for-language-advancement",
  //   title: "Loyola Initiative for Language Advancement",
  //   description: "Manage LILA organizing team and activities",
  //   icon: <Heart className="w-8 h-8" />,
  //   href: "/sys-ops/master-data/Students-engagements/loyola-initiative-for-language-advancement",
  //   color: "text-white",
  //   bgColor: "bg-primary",
  // },
  {
    id: "alumni",
    title: "Alumni",
    description: "Manage alumni users, gallery, events, awards & office bearers",
    icon: <Users className="w-8 h-8" />,
    href: "/sys-ops/master-data/alumni",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "Careers",
    title: "Careers",
    description: "Manage Careers related Announcements",
    icon: <UserCheck className="w-8 h-8" />,
    href: "/sys-ops/master-data/careers",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "Campus-Life",
    title: "Campus Life",
    description: "Manage Campus Life related Announcements",
    icon: <UserCheck className="w-8 h-8" />,
    href: "/sys-ops/master-data/campus-life",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "contact-info",
    title: "Contact Info",
    description: "Manage global campus contact information details",
    icon: <Database className="w-8 h-8" />,
    href: "/sys-ops/master-data/contact",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "contact-submissions",
    title: "Contact Submissions",
    description: "Read messages submitted via public contact form",
    icon: <UserCheck className="w-8 h-8" />,
    href: "/sys-ops/master-data/contact-submissions",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "news",
    title: "News",
    description: "Manage college news articles and announcements",
    icon: <FileText className="w-8 h-8" />,
    href: "/sys-ops/master-data/news",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "events",
    title: "Events",
    description: "Manage upcoming college events and schedules",
    icon: <CalendarCog className="w-8 h-8" />,
    href: "/sys-ops/master-data/events",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "event-reports",
    title: "Event Reports",
    description: "Manage past event reports and galleries",
    icon: <BookMarked className="w-8 h-8" />,
    href: "/sys-ops/master-data/event-reports",
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
          <Link key={card.id} href={card.href} className="block h-full">
            <div className="bg-white rounded-xl shadow-xl border border-primary p-6 h-full flex flex-col hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
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
