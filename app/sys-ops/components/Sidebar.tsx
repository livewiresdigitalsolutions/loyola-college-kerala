"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Settings,
  BarChart3,
  Users,
  FileBarChart,
  Database,
  Landmark,
  LogOut,
  UserStar,
  ShieldUser 
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/sys-ops/dashboard",
  },
  {
    name: "Admissions",
    icon: FileText,
    path: "/sys-ops/admissions",
  },
  {
    name: "Admin Users",  
    icon: ShieldUser ,          
    path: "/sys-ops/admin-users",  
  },
  {
    name: "Master Data",  
    icon: Database,          
    path: "/sys-ops/master-data",  
  },
  {
    name: "Allot Enterance Exam",  
    icon: Landmark,          
    path: "/sys-ops/hall-tickets",  
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/sys-ops/settings",
    disabled : true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("sys_ops_auth");
    sessionStorage.removeItem("sys_ops_user");
    sessionStorage.removeItem("sys_ops_token");
    router.push("/sys-ops/login");
  };

  return (
    <aside className="w-64 bg-[#342D87] text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Image
          src="/assets/loyolalogo.png"
          alt="SysOps Logo"
          width={250}
          height={60}
          className="w-auto h-18"
          priority
        />
        <p className="font-bold text-2xl text-white mt-2">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => !item.disabled && router.push(item.path)}
              disabled={item.disabled}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-white text-[#342D87] shadow-lg"
                    : item.disabled
                    ? "text-white/40 cursor-not-allowed"
                    : "text-white hover:bg-white/10"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
              {item.disabled && (
                <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-white hover:bg-red-500/20 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
