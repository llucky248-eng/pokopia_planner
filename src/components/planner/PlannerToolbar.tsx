"use client";

const MAX_CELLS = 135_424; // 368 × 368
const monoFont = "var(--font-geist-mono, 'JetBrains Mono', monospace)";

interface PlannerToolbarProps {
  itemCount: number;
}

export default function PlannerToolbar({ itemCount }: PlannerToolbarProps) {
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

      {/* Right: item count + progress */}
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
    </div>
  );
}
