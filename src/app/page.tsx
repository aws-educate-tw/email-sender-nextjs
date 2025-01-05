import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-28 shrink-0 rounded-lg bg-sky-950 p-4 md:h-52 md:items-end">
        <div className="flex items-center justify-center w-full md:justify-start">
          <Image
            src="/aws-educate-logo.png"
            alt="the logo of aws educate"
            width={600}
            height={600}
            className="w-64 md:w-96 object-contain"
          />
        </div>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        {/* Image container - moved up in mobile view using order utility */}
        <div className="flex items-center justify-center order-first md:order-last md:w-3/5 md:px-12 md:py-4">
          <Image
            src="/aws-educate-6th.jpg"
            width={1200}
            height={1000}
            className="w-full md:max-w-none md:block object-contain"
            alt="6th-aws-educate"
          />
        </div>
        {/* Content container */}
        <div className="flex flex-col items-center md:items-start justify-center gap-6 rounded-lg bg-gray-100 px-6 py-10 order-last md:order-first md:w-3/5 md:pl-20">
          <div className="text-gray-800 text-center md:text-left">
            <p className="text-xl md:text-3xl">
              <strong>Welcome to AWS Educate.</strong>
            </p>
            <p className="text-sm md:text-lg py-3">This is the TPET for AWS Ambassadors.</p>
          </div>
          <div className="flex flex-col gap-2 items-center md:flex-row md:items-start">
            <Link
              href="login"
              className="flex items-center gap-2 rounded-lg bg-sky-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-sky-900 md:text-base"
            >
              <p className="animate-pulse">Let&apos;s Get Started</p>
              <ArrowRightIcon size={20} className="animate-pulse" />
            </Link>
            <Link
              href="aboutUs"
              className="flex items-center gap-2 rounded-lg text-sky-950 px-6 py-3 text-sm font-medium transition-colors hover:text-sky-900 hover:underline md:text-base"
            >
              <p className="">About TPET</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
