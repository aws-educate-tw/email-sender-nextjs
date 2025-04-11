"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function SideNav() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const [triggerWidth, setTriggerWidth] = useState(192);
  const [canFitRight, setCanFitRight] = useState(true);
  const triggerRef = useRef<HTMLDivElement>(null);

  const signout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_expiry_time");
    router.push("/");
  };

  useEffect(() => {
    const update = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const rightSpace = window.innerWidth - rect.right;
        setTriggerWidth(triggerRef.current.offsetWidth);
        setCanFitRight(rightSpace > triggerWidth + 10); // 預留空間
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [triggerWidth]);

  return (
    <div className="flex h-full flex-col px-5 py-4 md:px-3 bg-gray-200 gap-2 min-w-60">
      <Link
        className="flex h-20 min-w-48 items-end justify-start rounded-md bg-sky-950 p-4 md:h-40"
        href="/"
      >
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
          href="/aboutUs"
          className="flex flex-grow min-w-48 max-h-10 items-center justify-center rounded-md bg-sky-950 p-4 hover:bg-sky-800"
        >
          <p className="px-3 text-white">About Us</p>
        </Link>
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

        <div className="relative w-full" ref={triggerRef}>
          <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className="flex flex-grow min-w-48 max-h-10 items-center justify-center rounded-md bg-sky-950 p-4 hover:bg-sky-800 cursor-pointer"
          >
            <p className="px-3 text-white">Sending History</p>
          </div>

          {isOpen &&
            triggerRef.current &&
            createPortal(
              <div
                className={`
                  fixed z-[9999] bg-white rounded-md shadow-lg
                `}
                style={{
                  top: canFitRight
                    ? triggerRef.current.getBoundingClientRect().top
                    : triggerRef.current.getBoundingClientRect().bottom,
                  left: canFitRight
                    ? triggerRef.current.getBoundingClientRect().right
                    : triggerRef.current.getBoundingClientRect().left,
                  width: triggerWidth,
                }}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
              >
                {[
                  { href: "/emailHistory", label: "Email History" },
                  { href: "/webhookSending", label: "Webhook Sending" },
                  { href: "/postmanMonitor", label: "Postman Monitor" },
                ].map((item, index, arr) => {
                  const isFirst = index === 0;
                  const isLast = index === arr.length - 1;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors duration-150
                        ${hoveredItem === item.href ? "bg-gray-300" : ""}
                        ${isFirst ? "rounded-t-md" : ""}
                        ${isLast ? "rounded-b-md" : ""}
                      `}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>,
              document.body
            )}
        </div>

        <Link
          href="/webhookService"
          className="flex flex-grow min-w-48 max-h-10 items-center justify-center rounded-md bg-sky-950 p-4 hover:bg-sky-800"
        >
          <p className="px-3 text-white">Webhook Service</p>
        </Link>
        <Link
          href="/webhookRecords"
          className="flex flex-grow min-w-48 max-h-10 items-center justify-center rounded-md bg-sky-950 p-4 hover:bg-sky-800"
        >
          <p className="px-3 text-white">Webhook Records</p>
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
