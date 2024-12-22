import { useState, useEffect, useMemo } from "react";
import Link from "next/link"; // Import Link component
import Image from "next/image";

export default function TopNav() {
  const navItems = useMemo(
    () => [
      { label: "Introduction", href: "#introduction" },
      { label: "DevTeam", href: "#dev-team" },
      { label: "TPET Guide", href: "#tpet-guide" },
    ],
    []
  );

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // Offset for the fixed header

      navItems.forEach(item => {
        const section = document.querySelector(item.href);
        if (section) {
          const top = (section as HTMLElement).offsetTop;
          const bottom = top + (section as HTMLElement).offsetHeight;
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(item.href);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const yOffset = -100; // Offset to account for fixed header
      const y = (element as HTMLElement).getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <header className="bg-sky-950 text-white py-4 fixed w-full top-0 z-10 shadow-md">
      <nav className="max-w-5xl container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Image
              src="/aws-educate-logo.png"
              alt="AWS Educate logo"
              width={300}
              height={300}
              className="hidden sm:block w-40"
            />
          </Link>
        </div>
        <ul className="flex space-x-6 ">
          <Link href="/" className="text-lg hover:text-amber-300">
            Home
          </Link>
          {navItems.map(item => (
            <li key={item.href}>
              <button
                className={`text-lg ${
                  activeSection === item.href ? "text-amber-300" : "text-white"
                } hover:text-amber-300`}
                onClick={() => scrollToSection(item.href)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
