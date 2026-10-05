"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { submitLogout } from "@/lib/actions";

export default function SideNav() {
  const router = useRouter();

  const signout = async () => {
    await submitLogout();
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_expiry_time");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex h-full flex-col p-4 backdrop-blur-md bg-gradient-to-r from-gray-100 to-gray-300 shadow-xl rounded-b-lg md:rounded-r-lg gap-2 w-full md:min-w-60">
      {/* Logo */}
      <Link
        className="flex items-center justify-start rounded-md bg-sky-950 p-4 h-20 md:h-40"
        href="/"
      >
        <Image
          src="/aws-educate-logo.png"
          alt="the logo of aws educate"
          width={500}
          height={400}
          className="w-full max-w-[180px] md:max-w-[240px]"
          priority
        />
      </Link>

      {/* Navigation Links */}
      <div className="flex flex-col justify-between h-full">
        {/* Top Section */}
        <div className="flex flex-col gap-2">
          <Link
            href="/emailService"
            className="w-full flex items-center justify-center rounded-md bg-sky-950 p-3 hover:bg-sky-800"
          >
            <p className="text-white text-sm sm:text-base">Email Service</p>
          </Link>
          <Link
            href="/emailHistory"
            className="w-full flex items-center justify-center rounded-md bg-sky-950 p-3 hover:bg-sky-800"
          >
            <p className="text-white text-sm sm:text-base">Email History</p>
          </Link>
          <Link
            href="/campaignService"
            className="w-full flex items-center justify-center rounded-md bg-sky-950 p-3 hover:bg-sky-800"
          >
            <p className="text-white text-sm sm:text-base">Event Service</p>
          </Link>
          <Link
            href="/webhookService"
            className="w-full flex items-center justify-center rounded-md bg-sky-950 p-3 hover:bg-sky-800"
          >
            <p className="text-white text-sm sm:text-base">Webhook Service</p>
          </Link>
          <Link
            href="/webhookRecords"
            className="w-full flex items-center justify-center rounded-md bg-sky-950 p-3 hover:bg-sky-800"
          >
            <p className="text-white text-sm sm:text-base">Webhook Records</p>
          </Link>
        </div>
        {/* Bottom Section */}
        <div className="flex flex-col gap-2">
          <Link
            href="/aboutUs"
            className="w-full flex items-center justify-center rounded-md bg-sky-950 p-3 hover:bg-sky-800"
          >
            <p className="text-white text-sm sm:text-base">About Us</p>
          </Link>
          {/* Sign Out Button */}
          <button
            className="w-full flex items-center justify-center rounded-md bg-sky-950 p-3 hover:bg-sky-800"
            type="button"
            onClick={signout}
          >
            <p className="text-white text-sm sm:text-base">Sign Out</p>
          </button>
        </div>
      </div>
    </div>
  );
}
