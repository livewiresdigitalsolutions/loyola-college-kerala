"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  UserCheck,
  Calendar,
  Building2,
} from "lucide-react";

interface AboutCard {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const aboutCards: AboutCard[] = [
  {
    id: "eminent-vistors",
    title: "Eminent Vistors",
    description: "Manage eminent vistors",
    href: "/sys-ops/master-data/about/eminent-visitors",
    icon: <Users className="w-6 h-6" />,
    color: "bg-blue-500",
  },
  {
    id: "pta",
    title: "PTA",
    description: "Manage PTA",
    href: "/sys-ops/master-data/about/pta",
    icon: <UserCheck className="w-6 h-6" />,
    color: "bg-green-500",
  },

];

export default function AboutManagement() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/sys-ops/master-data")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Academics Management
          </h1>
          <p className="text-gray-600 text-sm">
            Manage academic data — committees, faculty, calendar, and
            departments
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {aboutCards.map((card) => (
          <Link key={card.id} href={card.href}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group h-full">
              <div
                className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
              >
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-500 text-sm">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
