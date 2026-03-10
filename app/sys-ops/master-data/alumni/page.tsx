"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Image as ImageIcon, Calendar, Award, Crown, UserCog, Mail } from "lucide-react";

const alumniCards = [
  { id: "users", title: "Alumni Users", description: "View and manage registered alumni accounts", href: "/sys-ops/master-data/alumni/users", icon: <Users className="w-6 h-6" />, color: "bg-emerald-600" },
  { id: "gallery", title: "Gallery", description: "Upload and manage alumni event gallery images", href: "/sys-ops/master-data/alumni/gallery", icon: <ImageIcon className="w-6 h-6" />, color: "bg-blue-600" },
  { id: "events", title: "Events & Seminars", description: "Manage alumni events and seminar listings", href: "/sys-ops/master-data/alumni/events", icon: <Calendar className="w-6 h-6" />, color: "bg-purple-600" },
  { id: "awards", title: "Awards & Scholarships", description: "Manage award and scholarship records", href: "/sys-ops/master-data/alumni/awards", icon: <Award className="w-6 h-6" />, color: "bg-amber-500" },
  { id: "presidents", title: "Alumni Presidents", description: "Year-wise presidents, secretaries and treasurers", href: "/sys-ops/master-data/alumni/presidents", icon: <Crown className="w-6 h-6" />, color: "bg-rose-600" },
  { id: "office-bearers", title: "Office Bearers", description: "Manage office bearer and executive committee", href: "/sys-ops/master-data/alumni/office-bearers", icon: <UserCog className="w-6 h-6" />, color: "bg-teal-600" },
  { id: "messages", title: "Contact Messages", description: "View messages submitted via the contact form", href: "/sys-ops/master-data/alumni/messages", icon: <Mail className="w-6 h-6" />, color: "bg-gray-600" },
]

export default function AlumniAdminHub() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/sys-ops/master-data")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alumni Management</h1>
          <p className="text-gray-600 text-sm">Manage all alumni website content and user accounts</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumniCards.map((card) => (
          <Link key={card.id} href={card.href}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group h-full">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">{card.title}</h3>
              <p className="text-gray-500 text-sm">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
