import { decompressFromEncodedURIComponent } from "lz-string";
import { GridState } from "@/types";
import { getItemIndex, getItemByIndex } from "@/data/items";
import { GRID_SIZE } from "@/lib/constants";

// ── v4: grouped-delta varint (current) ───────────────────────────────────────
// Placements are grouped by catalog index. Within each group positions are
// sorted and stored as varint-encoded deltas of the linear index
// (row * GRID_SIZE + col). Same-type adjacent cells (common after painting)
// become single-byte entries, giving 44-71% shorter URLs than v3.
//
// Layout:
//   varint  : number of groups
//   per group:
//     uint16 BE : catalog index (0-1507)
//     varint    : count of placements in this group
//     varint[]  : sorted linear-index deltas (delta from prev, first is absolute)
//
// Compared to v3 (packed binary):
//   - 200 random items    : ~598  chars instead of ~1 072
//   - 200 painted (same)  : ~315  chars instead of ~1 072
//   - 1 000 random items  : ~2 695 chars instead of ~5 340
//   - 1 000 painted (60%) : ~1 926 chars instead of ~5 340
//
// ── v3: packed binary (legacy) ───────────────────────────────────────────────
// Each placement is packed into one big-endian uint32:
//   bits 18–28 : catalog index (11 bits)
//   bits  9–17 : row  (9 bits)
//   bits  0– 8 : col  (9 bits)
// Prefixed with "-v3-". Still decoded for backwards compatibility.
//
// ── v1 / v2: lz-string JSON (legacy) ─────────────────────────────────────────
// Still decoded for backwards compatibility with previously shared links.
//   v1: { s, p: [itemId, row, col][] }
//   v2: { v:2, s, p: [catalogIndex, row, col][] }

const V4_PREFIX = "-v4-";
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

/** Append a variable-length unsigned integer (7 bits/byte, LSB first). */
function writeVarint(value: number, out: number[]): void {
  while (value > 127) {
    out.push((value & 0x7f) | 0x80);
    value >>>= 7;
  }
  out.push(value & 0x7f);
}

/** Read a varint from bytes starting at offset. Returns [value, nextOffset]. */
function readVarint(bytes: Uint8Array, offset: number): [number, number] {
  let result = 0;
  let shift = 0;
  let pos = offset;
  while (pos < bytes.length) {
    const byte = bytes[pos++];
    result |= (byte & 0x7f) << shift;
    if (!(byte & 0x80)) break;
    shift += 7;
  }
  return [result, pos];
}

// ── public API ────────────────────────────────────────────────────────────────

export function compressGrid(grid: GridState): string {
  // Build groups: itemIdx → sorted linear positions (row * GRID_SIZE + col)
  const groups = new Map<number, number[]>();
  for (const { itemId, row, col } of grid.placements) {
    const idx = getItemIndex(itemId);
    if (idx < 0) continue;
    const lp = row * GRID_SIZE + col;
    let arr = groups.get(idx);
    if (!arr) { arr = []; groups.set(idx, arr); }
    arr.push(lp);
  }
  for (const arr of groups.values()) arr.sort((a, b) => a - b);

  const out: number[] = [];
  writeVarint(groups.size, out);
  for (const [idx, positions] of groups) {
    out.push((idx >> 8) & 0xff, idx & 0xff); // uint16 BE catalog index
    writeVarint(positions.length, out);
    let prev = 0;
    for (const lp of positions) {
      writeVarint(lp - prev, out);
      prev = lp;
    }
  }
  return V4_PREFIX + bytesToBase64url(new Uint8Array(out));
}

export function decompressGrid(compressed: string): GridState | null {
  // ── v4 ──
  if (compressed.startsWith(V4_PREFIX)) {
    try {
      const bytes = base64urlToBytes(compressed.slice(V4_PREFIX.length));
      let pos = 0;
      let [numGroups, nextPos] = readVarint(bytes, pos);
      pos = nextPos;
      let id = 1;
      const placements = [];
      for (let g = 0; g < numGroups; g++) {
        if (pos + 2 > bytes.length) return null;
        const itemIdx = (bytes[pos] << 8) | bytes[pos + 1];
        pos += 2;
        let [count, np] = readVarint(bytes, pos);
        pos = np;
        const catItem = getItemByIndex(itemIdx);
        let prev = 0;
        for (let i = 0; i < count; i++) {
          const [delta, np2] = readVarint(bytes, pos);
          pos = np2;
          const lp = prev + delta;
          prev = lp;
          if (catItem) {
            const row = Math.floor(lp / GRID_SIZE);
            const col = lp % GRID_SIZE;
            placements.push({ instanceId: `loaded-${id++}`, itemId: catItem.id, row, col });
          }
        }
      }
      return { size: GRID_SIZE, placements };
    } catch {
      return null;
    }
  }

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
