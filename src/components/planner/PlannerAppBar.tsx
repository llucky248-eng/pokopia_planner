"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function CloudMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.74)} viewBox="0 0 200 148" aria-hidden>
      <defs>
        <linearGradient id="appbar-cm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9ECAF2" />
          <stop offset="1" stopColor="#3F86D9" />
        </linearGradient>
      </defs>
      <path
        d="M40 116 Q12 114 20 84 Q4 64 28 54 Q32 26 60 32 Q74 8 102 22 Q132 4 152 28 Q186 28 186 66 Q200 84 184 104 Q174 124 146 120 L52 120 Q34 124 40 116 Z"
        fill="url(#appbar-cm)" stroke="#152033" strokeWidth="3" strokeLinejoin="round"
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

const TABS = [
  { href: "/", label: "Home" },
  { href: "/planner", label: "Planner" },
  { href: "/guide", label: "Guide", disabled: true },
];

const monoFont = "var(--font-geist-mono, 'JetBrains Mono', monospace)";

interface PlannerAppBarProps {
  onShare: () => void;
  onImport: () => void;
  isSharing?: boolean;
}

export default function PlannerAppBar({ onShare, onImport, isSharing = false }: PlannerAppBarProps) {
  const pathname = usePathname();

  return (
    <header
      className="flex items-center h-[52px] bg-white px-5 flex-shrink-0 gap-4 z-20"
      style={{ borderBottom: "1px solid rgba(20,40,80,0.10)" }}
    >
      {/* Left: brand + breadcrumb */}
      <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
        <CloudMark size={22} />
        <span className="font-bold text-[15px] tracking-tight text-[#152033]">Pokopia</span>
        <span className="font-medium text-[15px] text-[#6b7a92] hidden sm:inline">Planner</span>
        <div className="hidden md:flex items-center gap-2 ml-1">
          <span className="text-[#d0d8e4] select-none">|</span>
          <span
            className="text-[11px] text-[#6b7a92] whitespace-nowrap"
            style={{ fontFamily: monoFont }}
          >
            my-plans&nbsp;/&nbsp;<span className="text-[#152033] font-medium">cliffside-orchard.pkp</span>
            <span className="text-[#3f86d9] ml-1.5">• saved</span>
          </span>
        </div>
      </div>

      {/* Center: tab switcher */}
      <div className="flex-1 flex justify-center">
        <div
          className="flex gap-0.5 p-1 rounded-xl"
          style={{ background: "#f0f4fa" }}
        >
          {TABS.map(({ href, label, disabled }) => {
            const active = href === "/planner"
              ? pathname.startsWith("/planner")
              : pathname === href;
            return (
              <Link
                key={href}
                href={disabled ? "#" : href}
                onClick={disabled ? (e) => e.preventDefault() : undefined}
                className={`px-3.5 py-1 rounded-lg text-[12.5px] font-medium transition-colors ${
                  active
                    ? "bg-white text-[#152033] font-semibold"
                    : disabled
                      ? "text-[#b0bec5] cursor-not-allowed"
                      : "text-[#6b7a92] hover:text-[#152033]"
                }`}
                style={active ? { boxShadow: "0 1px 3px rgba(20,40,80,0.10)" } : {}}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6b7a92] hover:bg-[#f0f4fa] transition-colors cursor-pointer"
          title="Help"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
        </button>

        <button
          onClick={onImport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#152033] bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          style={{ border: "1px solid rgba(20,40,80,0.12)" }}
        >
          <ImportIcon /> <span className="hidden sm:inline">Import map</span>
        </button>

        <button
          onClick={onShare}
          disabled={isSharing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white rounded-lg cursor-pointer disabled:opacity-60"
          style={{ background: "#152033", boxShadow: "0 1px 2px rgba(20,40,80,0.12)" }}
        >
          <ShareIcon /> {isSharing ? "Sharing…" : "Share"}
        </button>
      </div>
    </header>
  );
}

const ImportIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShareIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="6" cy="12" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="18" cy="18" r="3" />
    <path d="M9 11l6-4M9 13l6 4" />
  </svg>
);
