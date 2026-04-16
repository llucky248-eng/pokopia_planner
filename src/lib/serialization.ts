import { decompressFromEncodedURIComponent } from "lz-string";
import { GridState } from "@/types";
import { getItemIndex, getItemByIndex } from "@/data/items";
import { GRID_SIZE } from "@/lib/constants";

// ── v3: packed binary (current) ───────────────────────────────────────────────
// Each placement is packed into one little-endian uint32:
//   bits  0– 8 : col  (9 bits, 0-367)
//   bits  9–17 : row  (9 bits, 0-367)
//   bits 18–28 : catalog index (11 bits, 0-1507)
//   bits 29–31 : (unused, zero)
//
// The byte array is base64url-encoded (no +/=, no percent-encoding needed) and
// prefixed with "-v3-". Grid size is always GRID_SIZE so it is not stored.
//
// Compared to v2 (JSON + lz-string):
//   - 200-item map  : ~1 072 chars instead of ~1 500-2 000
//   - 1 000-item map: ~2 672 chars instead of ~4 000-8 000
//   - Result is always proportional to item count (no lz variability)
//
// ── v1 / v2: lz-string JSON (legacy) ─────────────────────────────────────────
// Still decoded for backwards compatibility with previously shared links.
//   v1: { s, p: [itemId, row, col][] }
//   v2: { v:2, s, p: [catalogIndex, row, col][] }

const V3_PREFIX = "-v3-";

// ── helpers ───────────────────────────────────────────────────────────────────

function bytesToBase64url(bytes: Uint8Array): string {
  let binStr = "";
  for (let i = 0; i < bytes.length; i++) binStr += String.fromCharCode(bytes[i]);
  return btoa(binStr).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64urlToBytes(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const binStr = atob(b64);
  const bytes = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
  return bytes;
}

// ── public API ────────────────────────────────────────────────────────────────

export function compressGrid(grid: GridState): string {
  const buf = new Uint8Array(grid.placements.length * 4);
  const view = new DataView(buf.buffer);
  for (let i = 0; i < grid.placements.length; i++) {
    const { itemId, row, col } = grid.placements[i];
    const idx = getItemIndex(itemId);
    view.setUint32(
      i * 4,
      ((idx & 0x7ff) << 18) | ((row & 0x1ff) << 9) | (col & 0x1ff),
      false, // big-endian
    );
  }
  return V3_PREFIX + bytesToBase64url(buf);
}

export function decompressGrid(compressed: string): GridState | null {
  // ── v3 ──
  if (compressed.startsWith(V3_PREFIX)) {
    try {
      const bytes = base64urlToBytes(compressed.slice(V3_PREFIX.length));
      if (bytes.length % 4 !== 0) return null;
      const view = new DataView(bytes.buffer);
      let id = 1;
      const placements = [];
      for (let i = 0; i < bytes.length; i += 4) {
        const packed = view.getUint32(i, false);
        const col = packed & 0x1ff;
        const row = (packed >> 9) & 0x1ff;
        const idx = (packed >> 18) & 0x7ff;
        const catItem = getItemByIndex(idx);
        if (!catItem) continue;
        placements.push({ instanceId: `loaded-${id++}`, itemId: catItem.id, row, col });
      }
      return { size: GRID_SIZE, placements };
    } catch {
      return null;
    }
  }

  // ── v1 / v2 (lz-string JSON, legacy) ──
  try {
    const json = decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    const data = JSON.parse(json) as { v?: number; s: number; p: unknown[] };
    if (!data.s || !Array.isArray(data.p)) return null;
    let id = 1;

    if (data.v === 2) {
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
