import { PlacedItem } from "@/types";
import { GRID_SIZE } from "@/lib/constants";

/** Default catalog item IDs for wall and road placements. */
export const WALL_ITEM_ID = "blocks-stone-brick-wall";
export const ROAD_ITEM_ID = "blocks-stone-flooring";

export interface MapConvertOptions {
  outputSize: number;
  /** Sobel gradient magnitude threshold (0–255) for wall detection. Default 30. */
  wallThreshold: number;
  /** Max HSV saturation % (0–100) for a pixel to qualify as road. Default 20. */
  roadSatMax: number;
  /** Min brightness % (0–100) for road pixels. Default 30. */
  roadBriMin: number;
  /** Max brightness % (0–100) for road pixels. Default 85. */
  roadBriMax: number;
}

export interface ConvertResult {
  placements: PlacedItem[];
  previewPixels: Uint8ClampedArray; // RGBA, outputSize × outputSize
  outputSize: number;
}

function luminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function rgbSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  return max === 0 ? 0 : (max - min) / max;
}

/**
 * Converts a downscaled map image into catalog-item placements.
 *
 * Detection rules:
 *  - Wall: Sobel gradient magnitude ≥ wallThreshold (strong edges = building outlines).
 *  - Road: not wall, low saturation, mid brightness (gray asphalt / schematic road color).
 *  - Everything else: empty (no placement).
 *
 * Works for both satellite photos and schematic maps (OSM screenshots, etc.).
 */
export function convertMapToPlacements(
  source: ImageData,
  opts: MapConvertOptions,
): ConvertResult {
  const { outputSize, wallThreshold, roadSatMax, roadBriMin, roadBriMax } = opts;
  const src = source.data;
  const previewPixels = new Uint8ClampedArray(outputSize * outputSize * 4);
  const placements: PlacedItem[] = [];

  const xOffset = Math.floor((GRID_SIZE - outputSize) / 2);
  const yOffset = Math.floor((GRID_SIZE - outputSize) / 2);

  const stamp = Date.now();
  let idCounter = 0;

  // Grayscale buffer for Sobel convolution.
  const gray = new Float32Array(outputSize * outputSize);
  for (let i = 0; i < outputSize * outputSize; i++) {
    const pi = i * 4;
    gray[i] = luminance(src[pi], src[pi + 1], src[pi + 2]);
  }

  const satMaxF = roadSatMax / 100;
  const briMinF = roadBriMin / 100;
  const briMaxF = roadBriMax / 100;

  const w = outputSize;

  for (let y = 0; y < outputSize; y++) {
    for (let x = 0; x < outputSize; x++) {
      const pi = (y * w + x) * 4;
      const a = src[pi + 3];
      if (a < 64) continue;

      // Sobel 3×3 — clamp-to-edge for border pixels.
      const x0 = Math.max(x - 1, 0), x1 = x, x2 = Math.min(x + 1, w - 1);
      const y0 = Math.max(y - 1, 0), y1 = y, y2 = Math.min(y + 1, outputSize - 1);
      const tl = gray[y0 * w + x0], tc = gray[y0 * w + x1], tr = gray[y0 * w + x2];
      const ml =                        gray[y1 * w + x0],           mr = gray[y1 * w + x2];
      const bl = gray[y2 * w + x0], bc = gray[y2 * w + x1], br = gray[y2 * w + x2];

      const gx = -tl - 2 * ml - bl + tr + 2 * mr + br;
      const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;
      const gradMag = Math.sqrt(gx * gx + gy * gy);

      let itemId: string | null = null;
      let pr = 0, pg = 0, pb = 0;

      if (gradMag >= wallThreshold) {
        // Strong edge → building wall.
        itemId = WALL_ITEM_ID;
        pr = 105; pg = 100; pb = 95; // preview: dark warm-gray
      } else {
        // Road: low saturation, mid brightness.
        const r = src[pi], g2 = src[pi + 1], b = src[pi + 2];
        const sat = rgbSaturation(r, g2, b);
        const bri = luminance(r, g2, b) / 255;
        if (sat <= satMaxF && bri >= briMinF && bri <= briMaxF) {
          itemId = ROAD_ITEM_ID;
          pr = 200; pg = 200; pb = 195; // preview: light warm-gray
        }
      }

      if (itemId) {
        previewPixels[pi] = pr;
        previewPixels[pi + 1] = pg;
        previewPixels[pi + 2] = pb;
        previewPixels[pi + 3] = 255;

        placements.push({
          instanceId: `import-${stamp}-${idCounter++}`,
          itemId,
          row: yOffset + y,
          col: xOffset + x,
        });
      }
    }
  }

  return { placements, previewPixels, outputSize };
}
