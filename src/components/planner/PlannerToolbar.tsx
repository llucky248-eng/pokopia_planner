"use client";

const MAX_CELLS = 135_424; // 368 × 368
const monoFont = "var(--font-geist-mono, 'JetBrains Mono', monospace)";

interface PlannerToolbarProps {
  onUndo: () => void;
  onClear: () => void;
  onShare: () => void;
  onImport: () => void;
  itemCount: number;
  selectedItemName?: string | null;
  hoveredItemName?: string | null;
  measureDimensions?: { w: number; h: number } | null;
  toolMode: "place" | "erase" | "measure";
  onToggleErase: () => void;
  onToggleMeasure: () => void;
  isSharing?: boolean;
}

export default function PlannerToolbar({
  onUndo, onClear, onShare, onImport,
  itemCount, selectedItemName, hoveredItemName, measureDimensions,
  toolMode, onToggleErase, onToggleMeasure,
  isSharing = false,
}: PlannerToolbarProps) {
  const pct = Math.min(100, (itemCount / MAX_CELLS) * 100);

  const statusChip =
    toolMode === "erase"
      ? hoveredItemName ? `Erasing: ${hoveredItemName}` : "Eraser active"
      : toolMode === "measure"
        ? measureDimensions
          ? `${measureDimensions.w} × ${measureDimensions.h} cells`
          : "Drag to measure"
        : selectedItemName
          ? `Painting: ${selectedItemName}`
          : hoveredItemName
            ? hoveredItemName
            : null;

  return (
    <div
      className="flex items-center justify-between gap-4 bg-white px-5 py-3 flex-shrink-0"
      style={{ borderBottom: "1px solid rgba(20,40,80,0.10)" }}
    >
      {/* Left: title + status */}
      <div className="min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-[20px] font-semibold tracking-tight text-[#152033] m-0 leading-tight flex-shrink-0">
            Island Planner
          </h1>
          {statusChip && (
            <span
              className="text-[11px] px-2 py-0.5 rounded-full text-[#6b7a92] bg-[#f0f4fa] truncate max-w-[240px]"
              style={{ fontFamily: monoFont }}
            >
              {toolMode === "erase" ? "✕ " : toolMode === "measure" ? "↔ " : ""}{statusChip}
            </span>
          )}
        </div>
        <p
          className="text-[12px] text-[#6b7a92] mt-0.5 leading-none hidden sm:block"
          style={{ fontFamily: monoFont }}
        >
          368&nbsp;×&nbsp;368&nbsp;·&nbsp;Scroll to zoom&nbsp;·&nbsp;Drag to pan&nbsp;·&nbsp;Right-click to erase
        </p>
      </div>

      {/* Right: stats + actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Item count + progress */}
        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="flex items-baseline gap-1.5" style={{ fontFamily: monoFont }}>
            <span className="text-[10px] uppercase tracking-[0.06em] text-[#6b7a92]">placed</span>
            <span className="text-[17px] font-semibold text-[#152033]">
              {itemCount.toLocaleString()}
            </span>
            <span className="text-[12px] text-[#6b7a92]">
              / {MAX_CELLS.toLocaleString()}
            </span>
          </div>
          <div className="w-28 h-1.5 bg-[#e0e7f0] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #3f86d9, #7CB8F2)",
              }}
            />
          </div>
        </div>

        <div className="w-px h-8 bg-[rgba(20,40,80,0.10)]" />

        {/* Tool buttons */}
        <div className="flex items-center gap-1">
          <ToolBtn
            title={toolMode === "erase" ? "Stop erasing (E)" : "Eraser (E)"}
            onClick={onToggleErase}
            active={toolMode === "erase"}
            danger={toolMode === "erase"}
          >
            <EraserIcon />
          </ToolBtn>
          <ToolBtn
            title={toolMode === "measure" ? "Stop measuring (M)" : "Measure (M)"}
            onClick={onToggleMeasure}
            active={toolMode === "measure"}
          >
            <MeasureIcon />
          </ToolBtn>
          <ToolBtn title="Undo (⌘Z)" onClick={onUndo}>
            <UndoIcon />
          </ToolBtn>
        </div>

        <div className="w-px h-6 bg-[rgba(20,40,80,0.10)]" />

        {/* Import + Share + Clear */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onImport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#152033] bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            style={{ border: "1px solid rgba(20,40,80,0.12)" }}
          >
            <ImportIcon /> <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={onShare}
            disabled={isSharing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white rounded-lg cursor-pointer disabled:opacity-60"
            style={{ background: "#152033", boxShadow: "0 1px 2px rgba(20,40,80,0.12)" }}
          >
            <ShareIcon /> {isSharing ? "Sharing…" : "Share"}
          </button>
          <ToolBtn title="Clear all" onClick={onClear} danger>
            <TrashIcon />
          </ToolBtn>
        </div>
      </div>
    </div>
  );
}

function ToolBtn({
  children, title, onClick, active, danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
      style={
        active
          ? { background: "#152033", color: "white" }
          : danger
            ? { color: "#e15d4a" }
            : { color: "#3a4a66" }
      }
    >
      {children}
    </button>
  );
}

// Icons
const EraserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 3l5 5-12 12H4v-5L16 3z" strokeLinejoin="round" />
  </svg>
);
const MeasureIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="9" width="18" height="6" />
    <path d="M7 9v3M11 9v3M15 9v3M19 9v3" />
  </svg>
);
const UndoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 14L4 9l5-5M4 9h11a5 5 0 010 10h-3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ImportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="6" cy="12" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="18" cy="18" r="3" />
    <path d="M9 11l6-4M9 13l6 4" />
  </svg>
);
