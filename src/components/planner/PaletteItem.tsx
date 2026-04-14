"use client";

import { CatalogItem } from "@/types";

interface PaletteItemProps {
  item: CatalogItem;
  isSelected: boolean;
  onSelect: (itemId: string) => void;
}

export default function PaletteItem({ item, isSelected, onSelect }: PaletteItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-150 ${item.color} hover:shadow-md cursor-pointer text-left ${
        isSelected
          ? "ring-2 ring-sky-deep ring-offset-2 scale-[1.02] shadow-lg"
          : "hover:scale-[1.02]"
      }`}
    >
      <span className="text-xl flex-shrink-0">{item.emoji}</span>
      <span className="text-xs font-semibold text-text-primary truncate">{item.name}</span>
    </button>
  );
}
