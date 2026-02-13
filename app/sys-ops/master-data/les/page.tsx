// app/sys-ops/master-data/les/page.tsx
"use client";

import {
  Users,
  Image as ImageIcon,
  Newspaper,
  UserCheck,
  Phone,
  Building2,
  HeartPulse,
  Stethoscope,
  ClipboardList,
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
    id: "partners",
    title: "Partners",
    description: "Manage partner organizations",
    icon: <Building2 className="w-8 h-8" />,
    href: "/sys-ops/master-data/les/partners",
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
    title: "Counselors",
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
];

export default function LesManagement() {
  const router = useRouter();

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {lesCards.map((card) => (
          <Link key={card.id} href={card.href}>
            <div className="bg-white rounded-xl shadow-xl border border-primary p-6 h-50 hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
              <div className="bg-primary text-white w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
