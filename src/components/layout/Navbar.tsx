"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import pkg from "../../../package.json";

function CloudMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.74)} viewBox="0 0 200 148" aria-hidden>
      <defs>
        <linearGradient id="nav-cm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9ECAF2" />
          <stop offset="1" stopColor="#3F86D9" />
        </linearGradient>
      </defs>
      <path
        d="M40 116 Q12 114 20 84 Q4 64 28 54 Q32 26 60 32 Q74 8 102 22 Q132 4 152 28 Q186 28 186 66 Q200 84 184 104 Q174 124 146 120 L52 120 Q34 124 40 116 Z"
        fill="url(#nav-cm)" stroke="#152033" strokeWidth="3" strokeLinejoin="round"
      />
      <circle cx="78" cy="68" r="5" fill="#152033" />
      <circle cx="118" cy="68" r="5" fill="#152033" />
      <circle cx="80" cy="66" r="1.6" fill="white" />
      <circle cx="120" cy="66" r="1.6" fill="white" />
      <path d="M86 88 Q98 96 110 88" stroke="#152033" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="82" rx="5" ry="3" fill="#ffb1c1" opacity="0.8" />
      <ellipse cx="138" cy="82" rx="5" ry="3" fill="#ffb1c1" opacity="0.8" />
    </svg>
  );
}

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/planner", label: "Planner" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className="relative z-20 bg-white px-8 sm:px-12 py-3.5 flex items-center justify-between gap-6"
      style={{ borderBottom: "2px solid rgba(20,32,51,0.08)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <CloudMark size={28} />
        <span className="font-bold text-[17px] tracking-tight text-[#152033]">Pokopia</span>
        <span className="font-medium text-[17px] text-[#6b7a92]">Planner</span>
        {isHome && (
          <span
            className="ml-2 text-[11px] font-semibold bg-white px-2 py-0.5 rounded-full inline-block"
            style={{
              fontFamily: "var(--font-geist-mono, monospace)",
              border: "2px solid #152033",
              transform: "rotate(-3deg)",
              boxShadow: "0 2px 0 rgba(20,32,51,0.15)",
            }}
          >
            v{pkg.version}
          </span>
        )}
      </div>

      {/* Nav pill */}
      <nav
        className="flex gap-1 bg-white px-1.5 py-1.5 rounded-full"
        style={{ border: "2px solid #152033", boxShadow: "0 3px 0 rgba(20,32,51,0.12)" }}
      >
        {LINKS.map(({ href, label }) => {
          const active = pathname === href || (href === "/planner" && pathname.startsWith("/planner"));
          return (
            <Link
              key={href}
              href={href}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                active
                  ? "bg-amber-50 text-[#152033] font-bold"
                  : "text-[#3a4a66] hover:text-[#152033] font-semibold"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* CTA (home only) — spacer on planner */}
      {isHome ? (
        <Link
          href="/planner"
          className="inline-flex items-center gap-2 text-white text-sm font-bold px-4 py-2.5 rounded-full"
          style={{
            background: "#152033",
            border: "2px solid #152033",
            boxShadow: "0 3px 0 rgba(20,32,51,0.25)",
          }}
        >
          Open planner <span className="text-base leading-none">→</span>
        </Link>
      ) : (
        <div className="w-36 hidden sm:block" />
      )}
    </header>
  );
}
