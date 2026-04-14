"use client";

import { useDraggable } from "@dnd-kit/react";
import { CatalogItem } from "@/types";

interface PaletteItemProps {
  item: CatalogItem;
}

export default function PaletteItem({ item }: PaletteItemProps) {
  const { ref, isDragging } = useDraggable({
    id: `palette-${item.id}`,
    data: { type: "palette", itemId: item.id },
  });

  return (
    <div
      ref={ref}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-150 ${item.color} hover:shadow-md hover:scale-105 ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      <span className="text-xl">{item.emoji}</span>
      <span className="text-xs font-semibold text-text-primary truncate">{item.name}</span>
    </div>
  );
}
