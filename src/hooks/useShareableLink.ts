"use client";

import { useCallback } from "react";
import { GridState } from "@/types";
import { compressGrid, decompressGrid } from "@/lib/serialization";
import { SHARE_PARAM } from "@/lib/constants";
import { supabase, SHARE_SLUG_PARAM, SHARES_TABLE } from "@/lib/supabase";

const SLUG_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const SLUG_LENGTH = 8;
const MAX_SLUG_RETRIES = 3;

function plannerUrl(searchKey: string, value: string): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set(searchKey, value);
  return url.toString();
}

function randomSlug(): string {
  const bytes = new Uint8Array(SLUG_LENGTH);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < SLUG_LENGTH; i++) {
    out += SLUG_ALPHABET[bytes[i] % SLUG_ALPHABET.length];
  }
  return out;
}

export function useShareableLink() {
  const saveShare = useCallback(async (grid: GridState): Promise<string> => {
    if (!supabase) {
      // Supabase not configured — fall back to inline encoded link.
      return plannerUrl(SHARE_PARAM, compressGrid(grid));
    }
    const data = compressGrid(grid);
    let lastError: unknown = null;
    for (let attempt = 0; attempt < MAX_SLUG_RETRIES; attempt++) {
      const id = randomSlug();
      const { error } = await supabase
        .from(SHARES_TABLE)
        .insert({ id, data });
      if (!error) return plannerUrl(SHARE_SLUG_PARAM, id);
      // 23505 = Postgres unique_violation (slug collision); retry.
      if ((error as { code?: string }).code !== "23505") {
        lastError = error;
        break;
      }
      lastError = error;
    }
    throw lastError ?? new Error("Failed to save share");
  }, []);

  const loadFromUrl = useCallback((
    searchParams: URLSearchParams | { get(key: string): string | null }
  ): GridState | null => {
    const param = searchParams.get(SHARE_PARAM);
    if (!param) return null;
    return decompressGrid(param);
  }, []);

  const loadFromSlug = useCallback(async (
    slug: string
  ): Promise<GridState | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from(SHARES_TABLE)
      .select("data")
      .eq("id", slug)
      .maybeSingle();
    if (error || !data) return null;
    return decompressGrid(data.data as string);
  }, []);

  return { saveShare, loadFromUrl, loadFromSlug };
}
