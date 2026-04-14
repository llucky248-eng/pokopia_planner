"use client";

import { useState } from "react";
import { ItemCategory } from "@/types";
import { getItemsByCategory } from "@/data/items";
import PaletteItem from "./PaletteItem";

const TABS: { key: ItemCategory; label: string; icon: string }[] = [
  { key: "buildings", label: "Buildings", icon: "🏠" },
  { key: "decorations", label: "Decor", icon: "⛲" },
  { key: "terrain", label: "Terrain", icon: "🌿" },
  { key: "habitats", label: "Habitats", icon: "🔥" },
];

export default function ItemPalette() {
  const [activeTab, setActiveTab] = useState<ItemCategory>("buildings");
  const items = getItemsByCategory(activeTab);

  return (
    <div className="bg-surface rounded-2xl shadow-lg p-4 w-full lg:w-56 flex-shrink-0">
      <h3 className="font-bold text-sm text-text-primary mb-3">Items</h3>
      <div className="flex lg:flex-wrap gap-1 mb-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-sky-deep text-white shadow"
                : "bg-cloud-soft text-text-secondary hover:bg-cloud"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:max-h-[60vh] lg:overflow-y-auto pb-2 lg:pb-0">
        {items.map((item) => (
          <PaletteItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
