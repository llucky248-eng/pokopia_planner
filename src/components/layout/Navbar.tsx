"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/planner", label: "Planner" },
  { href: "/checklist", label: "Checklist" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="relative z-10 bg-gradient-to-r from-sky-deep to-sky-base shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <span className="text-2xl">☁️</span>
          <span>Pokopia Planner</span>
        </Link>
        <div className="flex gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-white/25 text-white"
                    : "text-white/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
