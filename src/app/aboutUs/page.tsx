"use client";

import TopNav from "@/app/ui/aboutUs/top-nav";
import Introduction from "@/app/ui/aboutUs/introduction";
import DevTeam from "@/app/ui/aboutUs/dev-team";
import TpetGuide from "@/app/ui/aboutUs/tpet-guide";
import TpetFooter from "@/app/ui/aboutUs/tpet-footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <TopNav />
      <div className="max-w-5xl mx-auto px-4 py-20 space-y-16">
        <Introduction />
        <DevTeam />
        <TpetGuide />
      </div>
      <TpetFooter />
    </div>
  );
}
