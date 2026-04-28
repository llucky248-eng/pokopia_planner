"use client";

import { getItemById } from "@/data/items";
import { tailwindToHex } from "@/lib/colors";

const MAX_CELLS = 135_424; // 368 × 368
const monoFont = "var(--font-geist-mono, 'JetBrains Mono', monospace)";

interface PlannerSidePanelProps {
  toolMode: "place" | "erase" | "measure";
  selectedItemId: string | null;
  hoveredItemName: string | null;
  cursorPos: { row: number; col: number } | null;
  itemCount: number;
  isSharing: boolean;
  onShare: () => void;
  onImport: () => void;
}

export default function PlannerSidePanel({
  toolMode,
  selectedItemId,
  hoveredItemName,
  cursorPos,
  itemCount,
  isSharing,
  onShare,
  onImport,
}: PlannerSidePanelProps) {
  const selectedItem = selectedItemId ? getItemById(selectedItemId) : null;
  const selectedItemName = selectedItem?.name ?? null;
  const swatchHex = selectedItem ? tailwindToHex(selectedItem.color) : null;

  const toolLabel =
    toolMode === "erase" ? "erase" : toolMode === "measure" ? "measure" : "brush";

  const itemLabel =
    toolMode === "place" && selectedItemName
      ? selectedItemName
      : toolMode === "erase" && hoveredItemName
        ? hoveredItemName.replace(/^\S+\s/, "")
        : "—";

  const pct = Math.min(100, (itemCount / MAX_CELLS) * 100);

  return (
    <aside
      className="w-full lg:w-[240px] flex-shrink-0 flex flex-col bg-white lg:max-h-[60vh] lg:self-start lg:order-3"
      style={{
        borderTop: "1px solid rgba(20,40,80,0.10)",
        borderLeft: "1px solid rgba(20,40,80,0.10)",
      }}
    >
      {/* Actions */}
      <div
        className="px-4 py-3 flex flex-col gap-2"
        style={{ borderBottom: "1px solid rgba(20,40,80,0.08)" }}
      >
        <button
          onClick={onShare}
          disabled={isSharing}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[12.5px] font-semibold text-white rounded-lg cursor-pointer disabled:opacity-60"
          style={{ background: "#152033", boxShadow: "0 1px 2px rgba(20,40,80,0.12)" }}
        >
          <ShareIcon /> {isSharing ? "Sharing…" : "Share"}
        </button>
        <button
          onClick={onImport}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[12.5px] font-medium text-[#152033] bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          style={{ border: "1px solid rgba(20,40,80,0.12)" }}
        >
          <ImportIcon /> Import map
        </button>
      </div>

      {/* Status */}
      <div
        className="px-4 py-3 flex flex-col gap-2"
        style={{
          borderBottom: "1px solid rgba(20,40,80,0.08)",
          fontFamily: monoFont,
          fontSize: 11,
        }}
      >
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] uppercase tracking-[0.06em] text-[#a0aec0]">tool</span>
          <span className="text-[#152033] font-medium">{toolLabel}</span>
        </div>
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[10px] uppercase tracking-[0.06em] text-[#a0aec0] flex-shrink-0">item</span>
          <span className="flex items-center gap-1.5 min-w-0">
            {swatchHex && (
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{
                  background: swatchHex,
                  border: "1px solid rgba(20,40,80,0.15)",
                }}
              />
            )}
            <span className="text-[#152033] font-medium truncate">{itemLabel}</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] uppercase tracking-[0.06em] text-[#a0aec0]">cursor</span>
          <span className="text-[#152033] font-medium">
            {cursorPos ? `${cursorPos.col}, ${cursorPos.row}` : "—"}
          </span>
        </div>
      </div>

      {/* Stats — hidden on mobile to save vertical space */}
      <div
        className="hidden lg:flex px-4 py-3 flex-col gap-1.5"
        style={{ borderBottom: "1px solid rgba(20,40,80,0.08)" }}
      >
        <div className="flex items-baseline justify-between" style={{ fontFamily: monoFont }}>
          <span className="text-[10px] uppercase tracking-[0.06em] text-[#6b7a92]">placed</span>
          <span>
            <span className="text-[14px] font-semibold text-[#152033]">
              {itemCount.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#6b7a92]">
              {" "}/ {MAX_CELLS.toLocaleString()}
            </span>
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#e0e7f0] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #3f86d9, #7CB8F2)",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-auto px-4 py-3 hidden lg:flex items-center justify-between"
        style={{
          fontFamily: monoFont,
          fontSize: 11,
          color: "#6b7a92",
          borderTop: "1px solid rgba(20,40,80,0.08)",
        }}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
          Autosaved
        </span>
        <span
          className="inline-flex items-center gap-1 text-[10px] text-[#6b7a92] bg-[#f0f4fa] px-1.5 py-0.5 rounded cursor-pointer hover:bg-[#e4ecf7] transition-colors"
          title="Keyboard shortcuts"
        >
          <kbd className="text-[9px]">?</kbd> shortcuts
        </span>
      </div>
    </aside>
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
