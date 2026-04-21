"use client";

import { useCallback } from "react";
import { GridState } from "@/types";
import { compressGrid, decompressGrid } from "@/lib/serialization";
import { SHARE_PARAM } from "@/lib/constants";

export function useShareableLink() {
  const generateLink = useCallback((grid: GridState): string => {
    const compressed = compressGrid(grid);
    const url = new URL(window.location.origin + "/planner");
    url.searchParams.set(SHARE_PARAM, compressed);
    return url.toString();
  }, []);

  const loadFromUrl = useCallback((
    searchParams: URLSearchParams | { get(key: string): string | null }
  ): GridState | null => {
    const param = searchParams.get(SHARE_PARAM);
    if (!param) return null;
    return decompressGrid(param);
  }, []);

  return { generateLink, loadFromUrl };
}
