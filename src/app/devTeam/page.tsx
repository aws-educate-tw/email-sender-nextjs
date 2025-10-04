"use client";

import TopNav from "@/app/ui/aboutUs/top-nav";
import DevTeam from "@/app/ui/aboutUs/dev-team";
import TpetFooter from "@/app/ui/aboutUs/tpet-footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <TopNav />
      <div className="max-w-5xl mx-auto py-32 space-y-16">
        <DevTeam />
      </div>
      <TpetFooter />
    </div>
  );
}
