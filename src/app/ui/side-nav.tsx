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
    <div className="flex h-full flex-col p-4 backdrop-blur-md bg-gradient-to-br from-gray-200 to-gray-400 shadow-xl rounded-b-lg md:rounded-r-lg gap-2 w-full md:min-w-60">
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
        <div className="flex flex-col gap-2 mt-2">
          <Link
            href="/emailService"
            className="w-full flex items-center justify-center rounded-md bg-sky-950 p-3 hover:bg-sky-800"
          >
            <p className="text-white text-sm sm:text-base">Email Service</p>
          </Link>

          {/* Dropdown Menu (Sending History) */}
          <div className="relative w-full" ref={triggerRef}>
            <div
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              className="w-full flex items-center justify-center rounded-md bg-sky-950 p-3 hover:bg-sky-800 cursor-pointer"
            >
              <p className="text-white text-sm sm:text-base">Sending History</p>
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
        <div className="flex flex-col gap-2 mt-2">
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
