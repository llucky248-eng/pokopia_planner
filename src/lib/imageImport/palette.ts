import { CATALOG_ITEMS, getItemsByCategory } from "@/data/items";
import { TAILWIND_TO_HEX } from "@/lib/colors";
import { CatalogItem, ItemCategory } from "@/types";

export interface PaletteEntry {
  itemId: string;
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
}

/**
 * Builds a deduped palette of 1x1 catalog items keyed by their Tailwind color.
 * Items with unknown Tailwind classes are skipped. First item per color wins.
 */
export function buildPalette(categoryId: "all" | ItemCategory): PaletteEntry[] {
  const source: CatalogItem[] =
    categoryId === "all" ? CATALOG_ITEMS : getItemsByCategory(categoryId);

  const seenHex = new Set<string>();
  const entries: PaletteEntry[] = [];

  for (const item of source) {
    const w = item.sizeW ?? 1;
    const h = item.sizeH ?? 1;
    if (w !== 1 || h !== 1) continue;

    const hex = TAILWIND_TO_HEX[item.color];
    if (!hex) continue;
    if (seenHex.has(hex)) continue;

    const rgb = hexToRgb(hex);
    if (!rgb) continue;

    seenHex.add(hex);
    entries.push({ itemId: item.id, ...rgb });
  }

  return entries;
}
