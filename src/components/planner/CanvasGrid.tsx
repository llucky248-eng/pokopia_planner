"use client";

import { useEffect } from "react";
import { GridState } from "@/types";
import { useCanvasRenderer } from "@/hooks/useCanvasRenderer";

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
}: CanvasGridProps) {
  const {
    canvasRef,
    minimapRef,
    cursorStyle,
    hoveredItemName,
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

        {/* Zoom controls */}
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
              style={{ fontFamily: "var(--font-geist-mono, monospace)" }}
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

        {/* Instructions overlay (only shown when empty) */}
        {grid.placements.length === 0 && (
          <div
            className="absolute top-3.5 left-3.5 z-10 bg-white/95 px-3 py-2.5 text-xs text-[#6b7a92] max-w-xs"
            style={{
              borderRadius: 10,
              border: "1px solid rgba(20,40,80,0.10)",
              boxShadow: "0 4px 12px rgba(20,40,80,0.10)",
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
        ? { height: 24, fontSize: 10, fontWeight: 600, fontFamily: "var(--font-geist-mono, monospace)", letterSpacing: "0.05em" }
        : { height: 32, fontSize: 16 }
      }
    >
      {label}
    </button>
  );
}
