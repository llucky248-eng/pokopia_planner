import { PlacedItem } from "@/types";
import { GRID_SIZE } from "@/lib/constants";
import { PaletteEntry } from "./palette";
import { FitMode } from "./downscale";

export interface ConvertOptions {
  outputSize: number;
  fitMode: FitMode;
  alphaThreshold: number; // 0..255
  palette: PaletteEntry[];
}

export interface ConvertResult {
  placements: PlacedItem[];
  previewPixels: Uint8ClampedArray; // RGBA, outputSize × outputSize
  outputSize: number;
}

/**
 * Converts downscaled ImageData into catalog-item placements centered on the
 * GRID_SIZE grid. Uses weighted-Euclidean nearest-color against the palette.
 * Pixels below the alpha threshold produce no placement.
 */
export function convertImageDataToPlacements(
  source: ImageData,
  opts: ConvertOptions,
): ConvertResult {
  const { outputSize, alphaThreshold, palette } = opts;
  const src = source.data;
  const previewPixels = new Uint8ClampedArray(outputSize * outputSize * 4);
  const placements: PlacedItem[] = [];

  const xOffset = Math.floor((GRID_SIZE - outputSize) / 2);
  const yOffset = Math.floor((GRID_SIZE - outputSize) / 2);

  const stamp = Date.now();
  let idCounter = 0;

  // Empty palette → no placements, transparent preview.
  if (palette.length === 0) {
    return { placements, previewPixels, outputSize };
  }

  for (let y = 0; y < outputSize; y++) {
    for (let x = 0; x < outputSize; x++) {
      const i = (y * outputSize + x) * 4;
      const r = src[i];
      const g = src[i + 1];
      const b = src[i + 2];
      const a = src[i + 3];

      if (a < alphaThreshold) {
        // Leave previewPixels transparent; skip placement.
        continue;
      }

      // Weighted Euclidean (0.3 R, 0.59 G, 0.11 B). Skip sqrt — monotonic.
      let bestDist = Infinity;
      let bestEntry = palette[0];
      for (let p = 0; p < palette.length; p++) {
        const e = palette[p];
        const dr = r - e.r;
        const dg = g - e.g;
        const db = b - e.b;
        const d = 0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db;
        if (d < bestDist) {
          bestDist = d;
          bestEntry = e;
        }
      }

      previewPixels[i] = bestEntry.r;
      previewPixels[i + 1] = bestEntry.g;
      previewPixels[i + 2] = bestEntry.b;
      previewPixels[i + 3] = 255;

      placements.push({
        instanceId: `import-${stamp}-${idCounter++}`,
        itemId: bestEntry.itemId,
        row: yOffset + y,
        col: xOffset + x,
      });
    }
  }

  return { placements, previewPixels, outputSize };
}
