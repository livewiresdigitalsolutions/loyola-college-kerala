// app/sys-ops/master-data/les/page.tsx
"use client";

import {
  Users,
  Image as ImageIcon,
  Newspaper,
  UserCheck,
  Phone,
  HeartPulse,
  Stethoscope,
  ClipboardList,
  CalendarCheck,
  MessageSquare,
  HandHeart,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface LesCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const lesCards: LesCard[] = [
  {
    id: "team",
    title: "Team Members",
    description: "Manage LES team members and their profiles",
    icon: <Users className="w-8 h-8" />,
    href: "/sys-ops/master-data/les/team",
  },
  {
    id: "news",
    title: "News",
    description: "Manage LES news items and announcements",
    icon: <Newspaper className="w-8 h-8" />,
    href: "/sys-ops/master-data/les/news",
  },
  {
    id: "gallery",
    title: "Gallery",
    description: "Manage LES gallery images",
    icon: <ImageIcon className="w-8 h-8" />,
    href: "/sys-ops/master-data/les/gallery",
  },
  {
    id: "coordinators",
    title: "Coordinators",
    description: "Manage LES coordinators and contact persons",
    icon: <UserCheck className="w-8 h-8" />,
    href: "/sys-ops/master-data/les/coordinators",
  },
  {
    id: "contact-info",
    title: "Contact Info",
    description: "Manage organization email, phone, address & hours",
    icon: <Phone className="w-8 h-8" />,
    href: "/sys-ops/master-data/les/contact-info",
  },
  {
    id: "assistance",
    title: "Assistance Contacts",
    description: "Manage immediate assistance phone contacts",
    icon: <HeartPulse className="w-8 h-8" />,
    href: "/sys-ops/master-data/les/assistance",
  },
  {
    id: "counselors",
    title: "Counselors & Slots",
    description: "Manage counselors and counseling time slots",
    icon: <Stethoscope className="w-8 h-8" />,
    href: "/sys-ops/master-data/les/counselors",
  },
  {
    id: "programs",
    title: "Programs",
    description: "Manage volunteer/internship programs",
    icon: <ClipboardList className="w-8 h-8" />,
    href: "/sys-ops/master-data/les/programs",
  },
  {
    id: "partners",
    title: "Partners",
    description: "Manage partner organizations",
    icon: <Building2 className="w-8 h-8" />,
    href: "/sys-ops/master-data/les/partners",
  },
];

const formCards: LesCard[] = [
  {
    id: "appointments",
    title: "Counselling Appointments",
    description: "View counselling appointment requests",
    icon: <CalendarCheck className="w-8 h-8" />,
    href: "/sys-ops/master-data/les/appointments",
  },
  {
    id: "contact-submissions",
    title: "Contact Submissions",
    description: "View messages from the contact form",
    icon: <MessageSquare className="w-8 h-8" />,
    href: "/sys-ops/master-data/les/contact-submissions",
  },
  {
    id: "volunteers",
    title: "Volunteer Registrations",
    description: "View volunteer/internship registrations",
    icon: <HandHeart className="w-8 h-8" />,
    href: "/sys-ops/master-data/les/volunteers",
  },
];

export default function LesManagement() {
  const router = useRouter();

  const renderCardGrid = (cards: LesCard[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Link key={card.id} href={card.href}>
          <div className="bg-white rounded-xl shadow-xl border border-primary p-6 min-h-[200px] overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
            <div className="bg-primary text-white w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
            <h3 className="text-xl font-bold text-primary mb-2 truncate">
              {card.title}
            </h3>
            <p className="text-primary text-sm line-clamp-2">{card.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            LES Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage Loyola Extension Service website data
          </p>
        </div>
      </div>

      {/* Master Data Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Master Data</h2>
        {renderCardGrid(lesCards)}
      </div>

      {/* Form Submissions Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Form Submissions</h2>
        {renderCardGrid(formCards)}
      </div>
    </div>
  );
}
