"use client";

import { useState } from "react";
import { ItemCategory } from "@/types";
import { getItemsByCategory, itemWidth, itemHeight } from "@/data/items";
import { tailwindToHex } from "@/lib/colors";

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

const monoFont = "var(--font-geist-mono, 'JetBrains Mono', monospace)";

interface ItemPaletteProps {
  selectedItemId: string | null;
  onSelectItem: (itemId: string) => void;
}

export default function ItemPalette({ selectedItemId, onSelectItem }: ItemPaletteProps) {
  const [activeTab, setActiveTab] = useState<ItemCategory>("buildings");
  const [search, setSearch] = useState("");

  const allItems = getItemsByCategory(activeTab);
  const filtered = search.trim()
    ? allItems.filter((it) => it.name.toLowerCase().includes(search.toLowerCase()))
    : allItems;

  return (
    <div
      className="flex flex-col bg-white w-full lg:w-[280px] flex-shrink-0 overflow-hidden"
      style={{ borderRight: "1px solid rgba(20,40,80,0.10)" }}
    >
      {/* Categories section */}
      <div className="p-3.5" style={{ borderBottom: "1px solid rgba(20,40,80,0.06)" }}>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span
            className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-[#6b7a92]"
            style={{ fontFamily: monoFont }}
          >
            Categories
          </span>
          <span
            className="text-[10.5px] text-[#6b7a92] bg-[#f0f4fa] px-1.5 py-0.5 rounded"
            style={{ fontFamily: monoFont }}
          >
            {TABS.length}
          </span>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 mb-3 bg-[#f7f9fc] rounded-lg text-[#6b7a92]"
          style={{ border: "1px solid rgba(20,40,80,0.10)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items…"
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#152033] placeholder:text-[#6b7a92]"
          />
          {search ? (
            <button
              onClick={() => setSearch("")}
              className="text-[#6b7a92] hover:text-[#152033] text-xs leading-none cursor-pointer"
            >
              ✕
            </button>
          ) : (
            <span
              className="text-[9px] text-[#a0aec0] bg-[#e8eef6] px-1.5 py-0.5 rounded font-medium flex-shrink-0"
              style={{ fontFamily: monoFont }}
            >
              ⌘K
            </span>
          )}
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 gap-1">
          {TABS.map((tab) => {
            const count = getItemsByCategory(tab.key).length;
            const active = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSearch(""); }}
                className="flex items-center gap-1.5 p-1.5 rounded-md text-left transition-colors cursor-pointer"
                style={
                  active
                    ? { background: "#eaf4fd", border: "1px solid rgba(63,134,217,0.25)", color: "#3f86d9" }
                    : { border: "1px solid transparent", color: "#152033" }
                }
              >
                <span className="text-[13px] leading-none">{tab.icon}</span>
                <span className={`flex-1 text-[12px] truncate ${active ? "font-semibold" : ""}`}>
                  {tab.label}
                </span>
                <span className="text-[10px] text-[#6b7a92]" style={{ fontFamily: monoFont }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto p-3.5 min-h-0">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span
            className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-[#6b7a92]"
            style={{ fontFamily: monoFont }}
          >
            {TABS.find((t) => t.key === activeTab)?.label}
          </span>
          <span
            className="text-[10.5px] text-[#6b7a92] bg-[#f0f4fa] px-1.5 py-0.5 rounded"
            style={{ fontFamily: monoFont }}
          >
            {filtered.length}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          {filtered.map((item) => {
            const selected = selectedItemId === item.id;
            const w = itemWidth(item);
            const h = itemHeight(item);
            return (
              <button
                key={item.id}
                onClick={() => onSelectItem(item.id)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left w-full transition-colors cursor-pointer"
                style={
                  selected
                    ? { background: "#152033", color: "white" }
                    : { color: "#152033" }
                }
              >
                <span
                  className="w-[18px] h-[18px] rounded flex-shrink-0"
                  style={{
                    background: tailwindToHex(item.color),
                    border: "1px solid rgba(0,0,0,0.12)",
                  }}
                />
                <span className="flex-1 text-[13px] truncate">{item.name}</span>
                <span
                  className="text-[10px] flex-shrink-0"
                  style={{
                    fontFamily: monoFont,
                    color: selected ? "rgba(255,255,255,0.65)" : "#6b7a92",
                  }}
                >
                  {w}×{h}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
