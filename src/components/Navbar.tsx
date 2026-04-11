"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { storage } from "@/lib/storage";

export default function Navbar() {
  const path = usePathname();
  const [name, setName] = useState("");
  const [interviewDone, setInterviewDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const acc = storage.getAccount();
    if (acc.name) setName(acc.name);
    const voice = storage.getVoice();
    setInterviewDone(!!voice?.interviewDone);
  }, []);

  const links = [
    { href: "/generate", label: "Generate" },
    { href: "/reply", label: "Reply" },
    { href: "/caption", label: "Caption" },
    { href: "/viral", label: "Viral Feed" },
    { href: "/history", label: "History" },
    { href: "/schedule", label: "Schedule" },
    { href: "/voice", label: "My Voice" },
  ];

  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const isActive = (href: string) =>
    path === href || path.startsWith(href + "/");

  // Pure Native CSS toggling method via group-has-[:checked]
  // This bypasses ALL React mobile freezing, iOS caching, and delegation bugs.
  
  const closeMenu = () => {
    const toggle = document.getElementById("mobile-menu-toggle") as HTMLInputElement;
    if (toggle) toggle.checked = false;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-100 group">
      {/* Hidden toggle switch tracking DOM state directly */}
      <input type="checkbox" id="mobile-menu-toggle" className="hidden peer" />

      {/* Mobile Menu Backdrop */}
      <label 
        htmlFor="mobile-menu-toggle"
        className="md:hidden fixed inset-0 z-40 bg-black/40 opacity-0 pointer-events-none group-has-[:checked]:opacity-100 group-has-[:checked]:pointer-events-auto transition-opacity duration-300 backdrop-blur-sm"
      />

      {/* Mobile Menu Dropdown */}
      <div className="md:hidden fixed top-14 left-0 right-0 bg-white shadow-xl z-[60] border-b border-gray-100 flex flex-col max-h-[calc(100vh-3.5rem)] overflow-y-auto opacity-0 pointer-events-none -translate-y-4 group-has-[:checked]:opacity-100 group-has-[:checked]:pointer-events-auto group-has-[:checked]:translate-y-0 transition-all duration-300">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={closeMenu}
            className={`flex items-center justify-between px-5 py-4 text-sm font-bold border-b border-gray-50 transition-colors active:bg-gray-100 ${
              isActive(l.href)
                ? "text-emerald-600 bg-emerald-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {l.label}
            {l.href === "/voice" && !interviewDone && (
              <span className="text-xs font-semibold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                Set up
              </span>
            )}
            {isActive(l.href) && (
              <span className="text-emerald-400 text-xs shadow-sm">●</span>
            )}
          </Link>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14 relative z-50 bg-white">
        {/* Logo */}
        <Link
          href="/generate"
          className="text-lg font-black tracking-tight shrink-0"
        >
          voice<span className="text-emerald-500">tweet</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isActive(l.href)
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {l.label}
              {l.href === "/voice" && !interviewDone && (
                <span className="ml-1 w-1.5 h-1.5 bg-amber-400 rounded-full inline-block align-middle" />
              )}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            href="/voice"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <span className="text-xs font-semibold text-gray-700 hidden lg:block">
              {name || "Profile"}
            </span>
          </Link>

          {/* Hamburger CSS-only toggle label */}
          <label
            htmlFor="mobile-menu-toggle"
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer relative z-[70] touch-manipulation"
          >
            <span className="block w-5 h-0.5 bg-gray-600 transition-all duration-300 origin-center group-has-[:checked]:rotate-45 group-has-[:checked]:translate-y-[8px]" />
            <span className="block w-5 h-0.5 bg-gray-600 transition-all duration-300 group-has-[:checked]:opacity-0" />
            <span className="block w-5 h-0.5 bg-gray-600 transition-all duration-300 origin-center group-has-[:checked]:-rotate-45 group-has-[:checked]:-translate-y-[8px]" />
          </label>
        </div>
      </div>
    </nav>
  );
}
