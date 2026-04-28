"use client";

const MAX_CELLS = 135_424; // 368 × 368
const monoFont = "var(--font-geist-mono, 'JetBrains Mono', monospace)";

interface PlannerToolbarProps {
  itemCount: number;
  onShare: () => void;
  onImport: () => void;
  isSharing?: boolean;
}

export default function PlannerToolbar({
  itemCount,
  onShare,
  onImport,
  isSharing = false,
}: PlannerToolbarProps) {
  const pct = Math.min(100, (itemCount / MAX_CELLS) * 100);

  return (
    <div
      className="flex items-center justify-between gap-4 bg-white px-5 py-3 flex-shrink-0"
      style={{ borderBottom: "1px solid rgba(20,40,80,0.10)" }}
    >
      {/* Left: title + subtitle */}
      <div className="min-w-0">
        <h1 className="text-[18px] font-semibold tracking-tight text-[#152033] m-0 leading-tight">
          Island Planner
        </h1>
        <p
          className="text-[11.5px] text-[#6b7a92] mt-0.5 leading-none hidden sm:block"
          style={{ fontFamily: monoFont }}
        >
          368&nbsp;×&nbsp;368&nbsp;·&nbsp;Scroll to zoom&nbsp;·&nbsp;Drag to pan&nbsp;·&nbsp;Right-click to erase
        </p>
      </div>

      {/* Right: progress + actions */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="flex items-baseline gap-1.5" style={{ fontFamily: monoFont }}>
            <span className="text-[10px] uppercase tracking-[0.06em] text-[#6b7a92]">placed</span>
            <span className="text-[16px] font-semibold text-[#152033]">
              {itemCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#6b7a92]">
              / {MAX_CELLS.toLocaleString()}
            </span>
          </div>
          <div className="w-24 h-1.5 bg-[#e0e7f0] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #3f86d9, #7CB8F2)",
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
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
      </div>
    </div>
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
