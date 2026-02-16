// app/sys-ops/master-data/page.tsx
"use client";

import {
  Database,
  Form,
  GraduationCap,
  BookOpen,
  MapPin,
  School,
  ImageIcon,
  CalendarCog ,
} from "lucide-react";
import Link from "next/link";

interface LES {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  bgColor: string;
}

const lesCards: LES[] = [
  {
    id: "LES Forms",
    title: "Counselling Appointments",
    description: "Counselling-appointments",
    icon: <Form className="w-8 h-8" />,
    href: "/sys-ops/les-forms/counselling-appointment-forms",
    color: "text-white",
    bgColor: "bg-primary",
  },
  {
    id: "LES Forms",
    title: "Student Volunteer ",
    description: "Student Volunteer Form",
    icon: <Form className="w-8 h-8" />,
    href: "/sys-ops/les-forms/student-volunteer-forms",
    color: "text-white",
    bgColor: "bg-primary",
  },
];

export default function LESForms() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          LES Forms Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage website configuration and reference data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {lesCards.map((card) => (
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
