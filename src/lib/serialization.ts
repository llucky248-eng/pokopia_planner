import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { GridState } from "@/types";
import { getItemIndex, getItemByIndex } from "@/data/items";

// ── v2 format ────────────────────────────────────────────────────────────────
// Stores each placement as [catalogIndex, row, col] (all numbers) instead of
// [itemId (string), row, col]. Numeric indices compress far better than
// repeated long strings like "buildings-wooden-steps", cutting URL length
// significantly for large maps.
//
// v1 format (string IDs) is still accepted by decompressGrid for backwards
// compatibility with previously shared links.

interface V2 {
  v: 2;
  s: number;
  p: [number, number, number][];
}

interface V1 {
  s: number;
  p: [string, number, number][];
}

export function compressGrid(grid: GridState): string {
  const v2: V2 = {
    v: 2,
    s: grid.size,
    p: grid.placements.map((p) => [getItemIndex(p.itemId), p.row, p.col]),
  };
  return compressToEncodedURIComponent(JSON.stringify(v2));
}

export function decompressGrid(compressed: string): GridState | null {
  try {
    const json = decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    const data = JSON.parse(json) as V1 | V2;
    if (!data.s || !Array.isArray(data.p)) return null;

    let id = 1;

    // v2: numeric catalog indices
    if ((data as V2).v === 2) {
      return {
        size: data.s,
        placements: (data.p as [number, number, number][])
          .filter(([idx]) => getItemByIndex(idx) !== undefined)
          .map(([idx, row, col]) => ({
            instanceId: `loaded-${id++}`,
            itemId: getItemByIndex(idx)!.id,
            row,
            col,
          })),
      };
    }

    // v1: string item IDs (legacy / backwards compat)
    return {
      size: data.s,
      placements: (data.p as [string, number, number][]).map(([itemId, row, col]) => ({
        instanceId: `loaded-${id++}`,
        itemId,
        row,
        col,
      })),
    };
  } catch {
    return null;
  }
}
