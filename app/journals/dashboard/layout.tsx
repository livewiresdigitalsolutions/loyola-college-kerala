"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useJournalAuth } from "../_components/AuthContext";
import {
  LayoutDashboard,
  User,
  FileText,
  PenTool,
  Loader2,
} from "lucide-react";

const sidebarItems = [
  { label: "Overview", href: "/journals/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/journals/dashboard/profile", icon: User },
  { label: "My Articles", href: "/journals/dashboard/articles", icon: FileText },
  { label: "New Article", href: "/journals/dashboard/articles/new", icon: PenTool },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoading } = useJournalAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-36">
              {/* User Info */}
              <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-primary font-bold text-lg">
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {user?.email}
                </p>
                {user?.affiliation && (
                  <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                    {user?.affiliation}
                  </p>
                )}
              </div>

              {/* Nav Items */}
              <nav className="p-2">
                {sidebarItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/journals/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-50 hover:text-foreground"
                      }`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
