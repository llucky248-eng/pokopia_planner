import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

export const SHARE_SLUG_PARAM = "s";
export const SHARES_TABLE = "shares";
