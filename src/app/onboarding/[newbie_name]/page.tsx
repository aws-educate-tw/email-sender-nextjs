"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  User,
  GraduationCap,
  Calendar,
  Briefcase,
  Terminal,
  Loader2,
  Sparkles,
} from "lucide-react";

interface OnboardingData {
  "first name": string;
  "last name": string;
  college: string;
  year: string;
  position: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || "";
        const newbieName = params.newbie_name;
        if (!newbieName) return;
        if (newbieName !== "aaron") {
          const mockData = {
            "first name": String(newbieName),
            "last name": "",
            college: "UNKNOWN",
            year: "UNKNOWN",
            position: "UNKNOWN",
          };

          await new Promise(r => setTimeout(r, 500));

          if (isMounted.current) {
            setData(mockData);
            setTimeout(() => setIsVisible(true), 100);
            setTimeout(() => setIsAnimated(true), 1000);
            setLoading(false);
          }
          return;
        }

        const response = await fetch(`${baseUrl}/onboarding/${newbieName}`);

        if (response.ok) {
          const result = await response.json();

          if (isMounted.current) {
            setData(result);
            setTimeout(() => {
              if (isMounted.current) setIsVisible(true);
            }, 100);
            setTimeout(() => {
              if (isMounted.current) setIsAnimated(true);
            }, 2000);
          }
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, [params.newbie_name]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-sky-400">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="text-sm font-medium tracking-widest uppercase animate-pulse">
          Initializing System...
        </p>
      </div>
    );
  }

  // Something wrong
  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-500 bg-red-500/10 p-6 rounded-lg border border-red-500/20 backdrop-blur-sm">
          <p className="text-xl font-bold">Error: Connection Failed</p>
          <p className="text-sm opacity-80 mt-2">Could not retrieve agent data.</p>
        </div>
      </div>
    );
  }

  // Show the information
  return (
    <main className="min-h-screen w-full bg-[#0f172a] relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-sky-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse delay-1000" />

      <div
        className={`relative w-full max-w-lg transition-all duration-1000 ease-out transform
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-sky-900/20 overflow-hidden transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-purple-400 to-sky-400" />

          <div
            className={`flex flex-col items-center mb-10 text-center transition-all duration-700 delay-300 transform ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="relative mb-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full opacity-75 blur animate-pulse"></div>
              <div className="relative w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-white border-2 border-slate-700 shadow-xl">
                {data["first name"]?.[0]}
                {data["last name"]?.[0]}
              </div>
              <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-slate-900 shadow-lg" />
            </div>

            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              Hi, I&apos;m {data["first name"]}{" "}
              <Sparkles className="text-yellow-400 w-6 h-6 animate-pulse" />
            </h1>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest">
              8th AWS Educate Cloud Ambassador
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              icon={<User className="text-sky-400" />}
              label="Full Name"
              value={`${data["first name"]} ${data["last name"]}`}
              show={isVisible}
              delay="400ms"
              isAnimated={isAnimated}
            />
            <InfoCard
              icon={<GraduationCap className="text-purple-400" />}
              label="College"
              value={data["college"]}
              show={isVisible}
              delay="500ms"
              isAnimated={isAnimated}
            />
            <InfoCard
              icon={<Calendar className="text-pink-400" />}
              label="Year"
              value={data["year"]}
              show={isVisible}
              delay="600ms"
              isAnimated={isAnimated}
            />
            <InfoCard
              icon={<Briefcase className="text-emerald-400" />}
              label="Position"
              value={data["position"]}
              show={isVisible}
              delay="700ms"
              isAnimated={isAnimated}
            />
          </div>

          <div
            className={`mt-10 flex justify-center transition-all duration-700 delay-[800ms] transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={() => router.push("/")}
              className="group/btn relative px-6 py-3 font-semibold text-white transition-all duration-300 ease-out rounded-full hover:scale-105 active:scale-95 bg-sky-600 hover:bg-sky-500 flex items-center gap-2 shadow-lg shadow-sky-500/30 overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
              <Terminal size={18} />
              <span>Go to TPET</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// Information card
function InfoCard({
  icon,
  label,
  value,
  show,
  delay,
  isAnimated,
  isHighlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  show: boolean;
  delay: string;
  isAnimated: boolean;
  isHighlight?: boolean;
}) {
  return (
    <div
      style={{ transitionDelay: isAnimated ? "0ms" : delay }}
      className={`p-4 rounded-xl border transition-all duration-300 transform
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        ${
          isHighlight
            ? "bg-gradient-to-br from-sky-900/40 to-slate-900/40 border-sky-500/30 hover:border-sky-400/50 hover:shadow-sky-500/20"
            : "bg-slate-800/40 border-white/5 hover:border-white/20 hover:bg-slate-800/60"
        }
        group/item hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 cursor-default
      `}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-slate-950/50 shadow-inner group-hover/item:scale-110 group-hover/item:bg-slate-900 transition-all duration-300">
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
            {label}
          </p>
          <p
            className={`text-base font-semibold ${
              isHighlight ? "text-sky-300" : "text-slate-200"
            } group-hover/item:text-white transition-colors`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
