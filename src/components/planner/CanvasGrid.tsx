"use client";

import { useEffect } from "react";
import { GridState } from "@/types";
import { useCanvasRenderer } from "@/hooks/useCanvasRenderer";
import { getItemById, itemWidth, itemHeight } from "@/data/items";
import { tailwindToHex } from "@/lib/colors";

const monoFont = "var(--font-geist-mono, 'JetBrains Mono', monospace)";

interface CanvasGridProps {
  grid: GridState;
  selectedItemId: string | null;
  toolMode: "place" | "erase" | "measure";
  onPlace: (itemId: string, row: number, col: number) => void;
  onRemove: (instanceId: string) => void;
  /** Called whenever the item under the cursor changes (null = no item). */
  onHoverItem?: (name: string | null) => void;
  /** Called whenever the committed measurement changes (null = cleared). */
  onMeasure?: (dims: { w: number; h: number } | null) => void;
  onBeginPaint?: () => void;
  onPaintCell?: (itemId: string, row: number, col: number) => void;
  onEndPaint?: () => void;
  onBeginErase?: () => void;
  onEraseCell?: (instanceId: string) => void;
  onEndErase?: () => void;
  onToggleErase?: () => void;
  onToggleMeasure?: () => void;
  onUndo?: () => void;
  onClear?: () => void;
  onCursorMove?: (cell: { row: number; col: number } | null) => void;
}

export default function CanvasGrid({
  grid,
  selectedItemId,
  toolMode,
  onPlace,
  onRemove,
  onHoverItem,
  onMeasure,
  onBeginPaint,
  onPaintCell,
  onEndPaint,
  onBeginErase,
  onEraseCell,
  onEndErase,
  onToggleErase,
  onToggleMeasure,
  onUndo,
  onClear,
  onCursorMove,
}: CanvasGridProps) {
  const {
    canvasRef,
    minimapRef,
    cursorStyle,
    hoveredItemName,
    hoveredCell,
    measureDimensions,
    zoomIn,
    zoomOut,
    resetView,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleContextMenu,
    handleMinimapMouseDown,
    handleMinimapMouseMove,
    handleMinimapMouseUp,
  } = useCanvasRenderer(
    grid,
    selectedItemId,
    toolMode,
    onPlace,
    onRemove,
    onBeginPaint ?? (() => {}),
    onPaintCell ?? (() => {}),
    onEndPaint ?? (() => {}),
    onBeginErase ?? (() => {}),
    onEraseCell ?? (() => {}),
    onEndErase ?? (() => {}),
  );

  useEffect(() => {
    onHoverItem?.(hoveredItemName);
  }, [hoveredItemName, onHoverItem]);

  useEffect(() => {
    onMeasure?.(measureDimensions);
  }, [measureDimensions, onMeasure]);

  useEffect(() => {
    onCursorMove?.(hoveredCell);
  }, [hoveredCell, onCursorMove]);

  // Selected item data for HUD
  const selectedItem = selectedItemId ? getItemById(selectedItemId) : null;

  return (
    <div className="relative">
      {/* Canvas container — square, responsive */}
      <div
        className="relative w-full overflow-hidden bg-[#cfe6fb]"
        style={{ aspectRatio: "1 / 1", borderRadius: 12, border: "1px solid rgba(20,40,80,0.10)" }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onContextMenu={handleContextMenu}
          style={{
            cursor: cursorStyle,
            display: "block",
            width: "100%",
            height: "100%",
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "none",
          }}
        />

        {/* Tool palette (left side overlay) */}
        <div
          className="absolute top-3.5 left-3.5 z-10 flex flex-col bg-white"
          style={{
            padding: 4, borderRadius: 10,
            border: "1px solid rgba(20,40,80,0.10)",
            boxShadow: "0 4px 12px rgba(20,40,80,0.10)",
          }}
        >
          <ToolPaletteBtn
            title="Brush (B)"
            active={toolMode === "place"}
            onClick={() => { if (toolMode !== "place") { onToggleErase?.(); } }}
          >
            <BrushIcon />
          </ToolPaletteBtn>
          <ToolPaletteBtn
            title={toolMode === "erase" ? "Stop erasing (E)" : "Eraser (E)"}
            active={toolMode === "erase"}
            danger={toolMode === "erase"}
            onClick={() => onToggleErase?.()}
          >
            <EraserIcon />
          </ToolPaletteBtn>
          <ToolPaletteBtn
            title={toolMode === "measure" ? "Stop measuring (M)" : "Measure (M)"}
            active={toolMode === "measure"}
            onClick={() => onToggleMeasure?.()}
          >
            <MeasureIcon />
          </ToolPaletteBtn>

          <div className="my-1 h-px bg-[rgba(20,40,80,0.08)]" />

          <ToolPaletteBtn title="Undo (⌘Z)" onClick={() => onUndo?.()}>
            <UndoIcon />
          </ToolPaletteBtn>

          <div className="my-1 h-px bg-[rgba(20,40,80,0.08)]" />

          <ToolPaletteBtn title="Clear all" danger onClick={() => onClear?.()}>
            <TrashIcon />
          </ToolPaletteBtn>
        </div>

        {/* Zoom controls (right side overlay) */}
        <div
          className="absolute top-3.5 right-3.5 z-10 flex flex-col bg-white"
          style={{
            padding: 4, borderRadius: 10,
            border: "1px solid rgba(20,40,80,0.10)",
            boxShadow: "0 4px 12px rgba(20,40,80,0.10)",
          }}
        >
          <ZoomBtn onClick={zoomIn} aria-label="Zoom in" label="＋" />
          <ZoomBtn onClick={resetView} aria-label="Fit view" label="FIT" mono />
          <ZoomBtn onClick={zoomOut} aria-label="Zoom out" label="−" />
        </div>

        {/* Minimap */}
        <div
          className="absolute bottom-3.5 right-3.5 z-10 bg-white overflow-hidden"
          style={{
            borderRadius: 10,
            border: "1px solid rgba(20,40,80,0.10)",
            boxShadow: "0 4px 12px rgba(20,40,80,0.10)",
          }}
        >
          <div
            className="flex justify-between items-center px-2.5 py-1"
            style={{ borderBottom: "1px solid rgba(20,40,80,0.06)" }}
          >
            <span
              className="text-[9.5px] font-semibold tracking-[0.1em] text-[#6b7a92]"
              style={{ fontFamily: monoFont }}
            >
              MINIMAP
            </span>
          </div>
          <canvas
            ref={minimapRef}
            onMouseDown={handleMinimapMouseDown}
            onMouseMove={handleMinimapMouseMove}
            onMouseUp={handleMinimapMouseUp}
            onMouseLeave={handleMinimapMouseUp}
            style={{ cursor: "pointer", display: "block" }}
          />
        </div>

        {/* Active item HUD (bottom-left, shown when an item is selected) */}
        {selectedItem && toolMode === "place" && (
          <div
            className="absolute bottom-3.5 left-3.5 z-10 flex items-center gap-2 bg-white px-2.5 py-1.5"
            style={{
              borderRadius: 10,
              border: "1px solid rgba(20,40,80,0.10)",
              boxShadow: "0 4px 12px rgba(20,40,80,0.10)",
            }}
          >
            <span
              className="w-3.5 h-3.5 rounded-sm flex-shrink-0"
              style={{
                background: tailwindToHex(selectedItem.color),
                border: "1px solid rgba(0,0,0,0.15)",
              }}
            />
            <span className="text-[11px] font-semibold text-[#152033] truncate max-w-[120px]">
              {selectedItem.name}
            </span>
            <span
              className="text-[10px] text-[#6b7a92] flex-shrink-0"
              style={{ fontFamily: monoFont }}
            >
              {itemWidth(selectedItem)}×{itemHeight(selectedItem)}
            </span>
          </div>
        )}

        {/* Measure result HUD (shown when measuring) */}
        {toolMode === "measure" && measureDimensions && (
          <div
            className="absolute bottom-3.5 left-3.5 z-10 flex items-center gap-1.5 bg-white px-2.5 py-1.5"
            style={{
              borderRadius: 10,
              border: "1px solid rgba(20,40,80,0.10)",
              boxShadow: "0 4px 12px rgba(20,40,80,0.10)",
            }}
          >
            <MeasureIcon />
            <span
              className="text-[11px] font-semibold text-[#152033]"
              style={{ fontFamily: monoFont }}
            >
              {measureDimensions.w}&nbsp;×&nbsp;{measureDimensions.h}
            </span>
          </div>
        )}

        {/* Instructions overlay (only shown when empty and in place mode) */}
        {grid.placements.length === 0 && toolMode === "place" && !selectedItem && (
          <div
            className="absolute top-3.5 left-3.5 z-10 bg-white/95 px-3 py-2.5 text-xs text-[#6b7a92] max-w-xs"
            style={{
              borderRadius: 10,
              border: "1px solid rgba(20,40,80,0.10)",
              boxShadow: "0 4px 12px rgba(20,40,80,0.10)",
              marginLeft: 44, // offset past tool palette
            }}
          >
            <p className="font-semibold text-[#152033] mb-1.5 text-[12px]">How to use</p>
            <ul className="space-y-1 text-[11px]">
              <li>Select an item from the palette</li>
              <li>Click or drag to paint items</li>
              <li>Drag anywhere to pan the map</li>
              <li>Scroll / pinch to zoom</li>
              <li>Right-click to remove items</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolPaletteBtn({
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

function ZoomBtn({ onClick, label, mono, ...rest }: {
  onClick: () => void;
  label: string;
  mono?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={rest["aria-label"]}
      className="w-8 flex items-center justify-center hover:bg-[#f0f4fa] rounded-md text-[#3a4a66] transition-colors cursor-pointer"
      style={mono
        ? { height: 24, fontSize: 10, fontWeight: 600, fontFamily: monoFont, letterSpacing: "0.05em" }
        : { height: 32, fontSize: 16 }
      }
    >
      {label}
    </button>
  );
}

// Icons
const BrushIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" strokeLinejoin="round" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" strokeLinejoin="round" />
  </svg>
);
const EraserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 3l5 5-12 12H4v-5L16 3z" strokeLinejoin="round" />
  </svg>
);
const MeasureIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="9" width="18" height="6" />
    <path d="M7 9v3M11 9v3M15 9v3M19 9v3" />
  </svg>
);
const UndoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 14L4 9l5-5M4 9h11a5 5 0 010 10h-3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
