import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { GridState, SerializedGrid } from "@/types";

export function compressGrid(grid: GridState): string {
  const serialized: SerializedGrid = {
    s: grid.size,
    p: grid.placements.map((p) => [p.itemId, p.row, p.col]),
  };
  return compressToEncodedURIComponent(JSON.stringify(serialized));
}

export function decompressGrid(compressed: string): GridState | null {
  try {
    const json = decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    const data = JSON.parse(json) as SerializedGrid;
    if (!data.s || !Array.isArray(data.p)) return null;

    let id = 1;
    return {
      size: data.s,
      placements: data.p.map(([itemId, row, col]) => ({
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
