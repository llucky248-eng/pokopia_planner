"use client";

import Button from "@/components/ui/Button";

interface PlannerToolbarProps {
  onUndo: () => void;
  onClear: () => void;
  onShare: () => void;
  itemCount: number;
}

export default function PlannerToolbar({ onUndo, onClear, onShare, itemCount }: PlannerToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-surface rounded-2xl shadow-lg px-4 py-3">
      <div className="text-sm font-semibold text-text-secondary">
        {itemCount} item{itemCount !== 1 ? "s" : ""} placed
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onUndo}>
          Undo
        </Button>
        <Button variant="danger" onClick={onClear}>
          Clear All
        </Button>
        <Button variant="accent" onClick={onShare}>
          Share
        </Button>
      </div>
    </div>
  );
}
