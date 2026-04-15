"use client";

import { useEffect } from "react";
import { GridState } from "@/types";
import { useCanvasRenderer } from "@/hooks/useCanvasRenderer";
import Button from "@/components/ui/Button";

interface CanvasGridProps {
  grid: GridState;
  selectedItemId: string | null;
  toolMode: "place" | "erase";
  onPlace: (itemId: string, row: number, col: number) => void;
  onRemove: (instanceId: string) => void;
  /** Called whenever the item under the cursor changes (null = no item). */
  onHoverItem?: (name: string | null) => void;
}

export default function CanvasGrid({
  grid,
  selectedItemId,
  toolMode,
  onPlace,
  onRemove,
  onHoverItem,
}: CanvasGridProps) {
  const {
    canvasRef,
    minimapRef,
    cursorStyle,
    hoveredItemName,
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
  } = useCanvasRenderer(grid, selectedItemId, toolMode, onPlace, onRemove);

  useEffect(() => {
    onHoverItem?.(hoveredItemName);
  }, [hoveredItemName, onHoverItem]);

  return (
    <div className="bg-surface/80 backdrop-blur rounded-2xl shadow-lg p-3 relative">
      {/* Canvas container (square, responsive) */}
      <div
        className="relative w-full rounded-xl overflow-hidden bg-sky-100"
        style={{ aspectRatio: "1 / 1" }}
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
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
          <Button variant="secondary" onClick={zoomIn} aria-label="Zoom in">
            +
          </Button>
          <Button variant="secondary" onClick={resetView} aria-label="Fit view">
            Fit
          </Button>
          <Button variant="secondary" onClick={zoomOut} aria-label="Zoom out">
            −
          </Button>
        </div>

        {/* Minimap */}
        <div className="absolute bottom-3 right-3 z-10 border-2 border-sky-700 rounded-lg overflow-hidden shadow-lg bg-white">
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
          <div className="absolute top-3 left-3 z-10 bg-white/90 rounded-lg px-3 py-2 text-xs text-text-secondary shadow max-w-xs">
            <p className="font-semibold text-text-primary mb-1">How to use</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Select an item from the palette</li>
              <li>Click a cell to place it</li>
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
