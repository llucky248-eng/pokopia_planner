"use client";

import Button from "@/components/ui/Button";

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
}

export default function PlannerToolbar({
  onUndo,
  onClear,
  onShare,
  onImport,
  itemCount,
  selectedItemName,
  hoveredItemName,
  measureDimensions,
  toolMode,
  onToggleErase,
  onToggleMeasure,
}: PlannerToolbarProps) {
  const statusText =
    toolMode === "erase"
      ? hoveredItemName
        ? `🧹 Erasing: ${hoveredItemName}`
        : "🧹 Eraser active — click to remove items"
      : toolMode === "measure"
        ? measureDimensions
          ? `📐 ${measureDimensions.w} × ${measureDimensions.h} cells`
          : "📐 Drag on the grid to measure an area"
        : selectedItemName
          ? `Click or drag to paint • ${selectedItemName}`
          : hoveredItemName
            ? `Hovering: ${hoveredItemName}`
            : "Select an item to place, or drag to pan";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-surface rounded-2xl shadow-lg px-4 py-3">
      <div className="flex flex-col gap-0.5">
        <div className="text-sm font-semibold text-text-primary">{statusText}</div>
        <div className="text-xs text-text-secondary">
          {itemCount} item{itemCount !== 1 ? "s" : ""} placed
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={toolMode === "erase" ? "danger" : "secondary"}
          onClick={onToggleErase}
        >
          {toolMode === "erase" ? "Stop Erasing" : "Eraser"}
        </Button>
        <Button
          variant={toolMode === "measure" ? "accent" : "secondary"}
          onClick={onToggleMeasure}
        >
          {toolMode === "measure" ? "Stop Measuring" : "Measure"}
        </Button>
        <Button variant="secondary" onClick={onUndo}>
          Undo
        </Button>
        <Button variant="danger" onClick={onClear}>
          Clear All
        </Button>
        <Button variant="secondary" onClick={onImport}>
          Import Map
        </Button>
        <Button variant="accent" onClick={onShare}>
          Share
        </Button>
      </div>
    </div>
  );
}
