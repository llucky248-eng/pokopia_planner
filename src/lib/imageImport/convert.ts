import { PlacedItem } from "@/types";
import { GRID_SIZE } from "@/lib/constants";

/** Default catalog item IDs for wall and road placements. */
export const WALL_ITEM_ID = "blocks-stone-brick-wall";
export const ROAD_ITEM_ID = "blocks-stone-flooring";

export interface MapConvertOptions {
  outputSize: number;
  /** Max HSV saturation % (0–100) for a pixel to qualify as road. Default 20. */
  roadSatMax: number;
  /** Min brightness % (0–100) for road pixels. Default 30. */
  roadBriMin: number;
  /** Max brightness % (0–100) for road pixels. Default 85. */
  roadBriMax: number;
  /**
   * Min saturation % (0–100) for a green/blue pixel to be classified as nature
   * (grass or water) and skipped. Lower = more aggressive nature skipping.
   * Default 18.
   */
  natureSatMin: number;
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
 * Classification order per pixel:
 *  1. **Nature** (grass / water / parks): green- or blue-dominant with enough
 *     saturation → skipped (no placement).
 *  2. **Road**: low saturation + mid brightness (gray paths / asphalt) → road tile.
 *  3. **Everything else** (buildings, warm-toned fills, dark edges) → wall tile,
 *     producing filled building footprints.
 *
 * Works for both satellite photos and schematic maps (OSM, Google Maps, etc.).
 */
export function convertMapToPlacements(
  source: ImageData,
  opts: MapConvertOptions,
): ConvertResult {
  const { outputSize, roadSatMax, roadBriMin, roadBriMax, natureSatMin } = opts;
  const src = source.data;
  const previewPixels = new Uint8ClampedArray(outputSize * outputSize * 4);
  const placements: PlacedItem[] = [];

  const xOffset = Math.floor((GRID_SIZE - outputSize) / 2);
  const yOffset = Math.floor((GRID_SIZE - outputSize) / 2);

  const stamp = Date.now();
  let idCounter = 0;

  const satMaxF = roadSatMax / 100;
  const briMinF = roadBriMin / 100;
  const briMaxF = roadBriMax / 100;
  const natureSatF = natureSatMin / 100;

  for (let y = 0; y < outputSize; y++) {
    for (let x = 0; x < outputSize; x++) {
      const pi = (y * outputSize + x) * 4;
      const r = src[pi], g = src[pi + 1], b = src[pi + 2], a = src[pi + 3];
      if (a < 64) continue;

      const sat = rgbSaturation(r, g, b);
      const bri = luminance(r, g, b) / 255;

      // 1. Nature: green- or blue-dominant, saturated enough → skip.
      const greenDominant = g > r && g > b && (g - Math.min(r, b)) > 12;
      const blueDominant = b > r && b > g && (b - Math.min(r, g)) > 12;
      if ((greenDominant || blueDominant) && sat >= natureSatF) {
        continue;
      }

      let itemId: string;
      let pr = 0, pg = 0, pb = 0;

      if (sat <= satMaxF && bri >= briMinF && bri <= briMaxF) {
        // 2. Road: low-saturation gray in mid brightness range.
        itemId = ROAD_ITEM_ID;
        pr = 200; pg = 200; pb = 195;
      } else {
        // 3. Building / wall: everything else (solid fill).
        itemId = WALL_ITEM_ID;
        pr = 105; pg = 100; pb = 95;
      }

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

  return { placements, previewPixels, outputSize };
}
