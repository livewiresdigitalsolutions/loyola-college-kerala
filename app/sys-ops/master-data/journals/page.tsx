"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  BookOpen,
  Mail,
  FileText,
  UserCheck,
} from "lucide-react";

interface JournalCard {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const journalCards: JournalCard[] = [
  {
    id: "board-members",
    title: "Board Members",
    description: "Manage editorial board and advisory board members",
    href: "/sys-ops/master-data/journals/board-members",
    icon: <Users className="w-6 h-6" />,
    color: "bg-blue-500",
  },
  {
    id: "issues",
    title: "Journal Issues",
    description: "Manage journal volumes, issues, and PDF uploads",
    href: "/sys-ops/master-data/journals/issues",
    icon: <BookOpen className="w-6 h-6" />,
    color: "bg-green-500",
  },
  {
    id: "contacts",
    title: "Contact Messages",
    description: "View messages submitted through the contact form",
    href: "/sys-ops/master-data/journals/contacts",
    icon: <Mail className="w-6 h-6" />,
    color: "bg-purple-500",
  },
  {
    id: "articles",
    title: "Article Submissions",
    description: "Review, approve, or reject submitted articles",
    href: "/sys-ops/master-data/journals/articles",
    icon: <FileText className="w-6 h-6" />,
    color: "bg-amber-500",
  },
  {
    id: "users",
    title: "Registered Users",
    description: "View and manage journal registered users",
    href: "/sys-ops/master-data/journals/users",
    icon: <UserCheck className="w-6 h-6" />,
    color: "bg-teal-500",
  },
];

export default function JournalsManagement() {
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
            Journals Management
          </h1>
          <p className="text-gray-600 text-sm">
            Manage journal board members, issues, and contact messages
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {journalCards.map((card) => (
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
