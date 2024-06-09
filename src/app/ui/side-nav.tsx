import Link from "next/link";
import Image from "next/image";
// import { HomeIcon } from "@heroicons/react/24/outline";

export default function SideNav() {
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
          href="/uploadFile"
          className="flex flex-grow min-w-48 max-h-10 items-center justify-center rounded-md bg-sky-950 p-4 hover:bg-sky-800"
        >
          <p className="px-3 text-white">Upload New Files</p>
        </Link>
        <Link
          href="/listFiles"
          className="flex flex-grow min-w-48 max-h-10 items-center justify-center rounded-md bg-sky-950 p-4 hover:bg-sky-800"
        >
          <p className="px-3 text-white">TPET drive</p>
        </Link>
        <Link
          href="/sendEmail"
          className="flex flex-grow min-w-48 max-h-10 items-center justify-center rounded-md bg-sky-950 p-4 hover:bg-sky-800"
        >
          <p className="px-3 text-white">Send Email</p>
        </Link>
        {/* <Link
          href="/htmlTemplate"
          className="flex flex-grow min-w-48 max-h-10 items-center justify-center rounded-md bg-sky-950 p-4 hover:bg-sky-800"
        >
          <p className="px-3 text-white">HTML Template</p>
        </Link>
        <Link
          href="/htmlRichEditor"
          className="flex flex-grow min-w-48 max-h-10 items-center justify-center rounded-md bg-sky-950 p-4 hover:bg-sky-800"
        >
          <p className="px-3 text-white">HTML Rich Editor</p>
        </Link> */}
      </div>
    </div>
  );
}
