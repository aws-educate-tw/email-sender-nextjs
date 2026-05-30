"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideNav from "@/app/ui/side-nav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const expiryTime = localStorage.getItem("token_expiry_time");
    const isValid = accessToken && expiryTime && new Date().getTime() <= parseInt(expiryTime, 10);

    if (!isValid) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expiry_time");
      router.replace("/login");
      return;
    }

    setIsAuthenticated(true);
    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
