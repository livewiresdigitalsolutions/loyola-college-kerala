"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

export default function SysOpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("sys_ops_auth");

    if (pathname === "/sys-ops/login") {
      setIsLoading(false);
      return;
    }

    if (authStatus === "true") {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      router.push("/sys-ops/login");
    }
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div>
      </div>
    );
  }

  if (pathname === "/sys-ops/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto scroll-smooth p-6">{children}</main>
      </div>
    </div>
  );
}
