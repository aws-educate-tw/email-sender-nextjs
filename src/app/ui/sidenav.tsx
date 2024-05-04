import Link from "next/link";
import Image from "next/image";
import { HomeIcon } from "@heroicons/react/24/outline";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-5 py-4 md:px-3 bg-gray-200">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-sky-950 p-4 md:h-40"
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
      <div className="flex grow flex-row justify-start space-x-2 md:flex-col md:space-x-0 md:space-y-2 rounded-md">
        <Link
          href="/"
          className="flex h-6 items-center justify-center rounded-md bg-sky-950 p-4 md:h-10 hover:bg-sky-800"
        >
          <HomeIcon className="w-6 stroke-white" />
          <p className="px-3 text-white">Go Home</p>
        </Link>
        <Link
          href="/htmlTemplate"
          className="mb-2 flex h-6 items-center justify-center rounded-md bg-sky-950 p-4 md:h-10 hover:bg-sky-800"
        >
          <p className="px-3 text-white">HTML creator</p>
        </Link>
      </div>
    </div>
  );
}
