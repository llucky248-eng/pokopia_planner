"use client";

import { useDroppable } from "@dnd-kit/react";
import { useDraggable } from "@dnd-kit/react";
import { PlacedItem } from "@/types";
import { getItemById } from "@/data/items";

interface GridCellProps {
  row: number;
  col: number;
  placement: PlacedItem | undefined;
  onRemove: (instanceId: string) => void;
}

export default function GridCell({ row, col, placement, onRemove }: GridCellProps) {
  const { ref: dropRef, isDropTarget } = useDroppable({
    id: `cell-${row}-${col}`,
    data: { type: "cell", row, col },
  });

  const catalogItem = placement ? getItemById(placement.itemId) : undefined;

  return (
    <div
      ref={dropRef}
      className={`aspect-square border border-sky-base/20 rounded-lg flex items-center justify-center transition-all duration-150 relative group ${
        isDropTarget
          ? "bg-sky-base/30 border-sky-deep scale-105 shadow-md"
          : placement && catalogItem
            ? catalogItem.color
            : "bg-white/60 hover:bg-white/80"
      }`}
    >
      {placement && catalogItem ? (
        <PlacedItemCell
          placement={placement}
          emoji={catalogItem.emoji}
          name={catalogItem.name}
          onRemove={onRemove}
        />
      ) : null}
    </div>
  );
}

function PlacedItemCell({
  placement,
  emoji,
  name,
  onRemove,
}: {
  placement: PlacedItem;
  emoji: string;
  name: string;
  onRemove: (instanceId: string) => void;
}) {
  const { ref, isDragging } = useDraggable({
    id: `placed-${placement.instanceId}`,
    data: { type: "placed", instanceId: placement.instanceId, itemId: placement.itemId },
  });

  return (
    <div
      ref={ref}
      className={`w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing relative ${
        isDragging ? "opacity-40" : ""
      }`}
      title={name}
    >
      <span className="text-lg sm:text-xl">{emoji}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(placement.instanceId);
        }}
        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600"
        title="Remove"
      >
        &times;
      </button>
    </div>
  );
}
