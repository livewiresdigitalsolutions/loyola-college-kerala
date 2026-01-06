"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SysOpsPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("sys_ops_auth");
    if (isAuthenticated === "true") {
      router.push("/sys-ops/dashboard");
    } else {
      router.push("/sys-ops/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
