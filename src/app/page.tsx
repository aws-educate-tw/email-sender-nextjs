import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-sky-950 p-4 md:h-52">
        <Image
          src="/aws-educate-logo.png"
          alt="the logo of aws educate"
          width={600}
          height={500}
          className="w-60 sm:w-60 md:w-96"
        />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-100 px-6 py-10 md:w-3/5 md:px-20">
          <p className="text-xl text-gray-800 md:text-3xl md:leading-normal">
            <strong>Welcome to AWS Educate.</strong>
            <br />
            <span className="text-lg">
              This is the TPET for AWS Ambassadors
            </span>
          </p>
          <Link
            href="login"
            className="flex items-center gap-2 self-start rounded-lg bg-sky-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-sky-900 md:text-base"
          >
            <p className="animate-pulse">Let&apos;s Get Started</p>
            <ArrowRightIcon size={20} className="animate-pulse" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-12 md:py-4">
          <Image
            src="/aws-educate-6th.jpg"
            width={1200}
            height={1000}
            className="hidden md:block"
            alt="6th-aws-educate"
          />
        </div>
      </div>
    </main>
  );
}
