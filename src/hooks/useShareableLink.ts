"use client";

import { useCallback } from "react";
import { GridState } from "@/types";
import { compressGrid, decompressGrid } from "@/lib/serialization";
import { SHARE_PARAM, BLOB_PARAM, JSONBLOB_API } from "@/lib/constants";

export function useShareableLink() {
  const generateLink = useCallback((grid: GridState): string => {
    const compressed = compressGrid(grid);
    const url = new URL(window.location.origin + "/planner");
    url.searchParams.set(SHARE_PARAM, compressed);
    return url.toString();
  }, []);

  const loadFromUrl = useCallback(async (
    searchParams: URLSearchParams | { get(key: string): string | null }
  ): Promise<GridState | null> => {
    const blobId = searchParams.get(BLOB_PARAM);
    if (blobId) {
      try {
        const res = await fetch(`${JSONBLOB_API}/${blobId}`);
        if (!res.ok) return null;
        const data = await res.json() as { plan?: string };
        if (data.plan) return decompressGrid(data.plan);
      } catch {
        return null;
      }
    }
    const param = searchParams.get(SHARE_PARAM);
    if (!param) return null;
    return decompressGrid(param);
  }, []);

  return { generateLink, loadFromUrl };
}
