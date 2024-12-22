import { useState, useEffect } from "react";

export default function TopNav() {
  const navItems = [
    { label: "Introduction", href: "#introduction" },
    { label: "DevTeam", href: "#dev-team" },
    { label: "TPET Guide", href: "#tpet-guide" },
  ];
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
    <header className="bg-gray-800 text-white py-4 fixed w-full top-0 z-10 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">AWS Educate Dev Team</h1>
        <ul className="flex space-x-6">
          {navItems.map(item => (
            <li key={item.href}>
              <button
                className={`text-lg ${
                  activeSection === item.href ? "text-blue-400" : "text-white"
                } hover:text-blue-400`}
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
