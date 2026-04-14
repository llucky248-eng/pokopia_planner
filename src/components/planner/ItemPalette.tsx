"use client";

import { useState } from "react";
import { ItemCategory } from "@/types";
import { getItemsByCategory } from "@/data/items";
import PaletteItem from "./PaletteItem";

const TABS: { key: ItemCategory; label: string; icon: string }[] = [
  { key: "buildings", label: "Buildings", icon: "🏠" },
  { key: "blocks", label: "Blocks", icon: "🧱" },
  { key: "nature", label: "Nature", icon: "🌿" },
  { key: "outdoor", label: "Outdoor", icon: "🏕️" },
  { key: "furniture", label: "Furniture", icon: "🪑" },
  { key: "utilities", label: "Utilities", icon: "⚙️" },
  { key: "materials", label: "Materials", icon: "📦" },
  { key: "food", label: "Food", icon: "🍎" },
  { key: "misc", label: "Misc.", icon: "✨" },
  { key: "kits", label: "Kits", icon: "🛖" },
  { key: "key-items", label: "Key Items", icon: "🗝️" },
  { key: "other", label: "Other", icon: "🎁" },
  { key: "lost-relics-l", label: "Relics (L)", icon: "🏺" },
  { key: "lost-relics-s", label: "Relics (S)", icon: "💠" },
  { key: "fossils", label: "Fossils", icon: "🦴" },
];

interface ItemPaletteProps {
  selectedItemId: string | null;
  onSelectItem: (itemId: string) => void;
}

export default function ItemPalette({ selectedItemId, onSelectItem }: ItemPaletteProps) {
  const [activeTab, setActiveTab] = useState<ItemCategory>("buildings");
  const items = getItemsByCategory(activeTab);

  return (
    <div className="bg-surface rounded-2xl shadow-lg p-4 w-full lg:w-60 flex-shrink-0">
      <h3 className="font-bold text-sm text-text-primary mb-3">Items</h3>
      <div className="flex flex-wrap gap-1 mb-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-sky-deep text-white shadow"
                : "bg-cloud-soft text-text-secondary hover:bg-cloud"
            }`}
            title={tab.label}
          >
            <span>{tab.icon}</span>
            <span className="hidden lg:inline">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:max-h-[60vh] lg:overflow-y-auto pb-2 lg:pb-0">
        {items.map((item) => (
          <PaletteItem
            key={item.id}
            item={item}
            isSelected={selectedItemId === item.id}
            onSelect={onSelectItem}
          />
        ))}
      </div>
    </div>
  );
}
