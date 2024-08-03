"use client";
import Link from "next/link";
import Image from "next/image";
// import { HomeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function SideNav() {
  const router = useRouter();
  const signout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_expiry_time");
    router.push("/");
  };
  return (
    <div className="flex h-full flex-col px-5 py-4 md:px-3 bg-gray-200 gap-2 min-w-60">
      <Link
        className="flex h-20 min-w-48 items-end justify-start rounded-md bg-sky-950 p-4 md:h-40"
        href="/"
      >
        {/* <p className="text-white text-2xl">aws educate</p> */}
        <Image
          src="/aws-educate-logo.png"
          alt="the logo of aws educate"
          width={500}
          height={400}
          className="w-60 sm:w-60 md:w-96"
        />
      </Link>
      <div className="flex grow flex-row flex-wrap justify-start gap-2 md:flex-col md:space-x-0 rounded-md">
        <Link
          href="/templateEdit"
          className="flex flex-grow min-w-48 max-h-10 items-center justify-center rounded-md bg-sky-950 p-4 hover:bg-sky-800"
        >
          <p className="px-3 text-white">Create Template</p>
        </Link>
        <Link
          href="/sendEmail"
          className="flex flex-grow min-w-48 max-h-10 items-center justify-center rounded-md bg-sky-950 p-4 hover:bg-sky-800"
        >
          <p className="px-3 text-white">Send Email</p>
        </Link>
        <Link
          href="/emailHistory"
          className="flex flex-grow min-w-48 max-h-10 items-center justify-center rounded-md bg-sky-950 p-4 hover:bg-sky-800"
        >
          <p className="px-3 text-white">Email History</p>
        </Link>
      </div>
      <div>
        <button
          className="flex flex-grow min-w-48 max-h-10 items-center justify-center rounded-md bg-sky-950 p-4 hover:bg-sky-800 w-full"
          type="button"
          onClick={signout}
        >
          <p className="px-3 text-white">Sign Out</p>
        </button>
      </div>
    </div>
  );
}
