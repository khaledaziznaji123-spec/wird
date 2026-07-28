import { createClient } from "@/lib/supabase/server";

export type Hadith = {
  id: number;
  collection: string;
  reference: string | null;
  arabic_text: string;
  english_text: string | null;
};

/** Keyword search over Arabic + English hadith text. */
export async function searchHadith(qRaw: string): Promise<Hadith[]> {
  const q = qRaw.replace(/[%,()]/g, " ").trim();
  if (!q) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("hadiths")
    .select("*")
    .or(`arabic_text.ilike.%${q}%,english_text.ilike.%${q}%`)
    .limit(20);
  return data ?? [];
}

/** IDs of hadith the current user has favorited. */
export async function getFavoriteIds(): Promise<number[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("favorites")
    .select("hadith_id")
    .eq("user_id", user.id);
  return (data ?? []).map((r) => r.hadith_id);
}

/** The current user's saved hadith. */
export async function getFavorites(): Promise<Hadith[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: favs } = await supabase
    .from("favorites")
    .select("hadith_id")
    .eq("user_id", user.id);
  const ids = (favs ?? []).map((r) => r.hadith_id);
  if (ids.length === 0) return [];
  const { data } = await supabase.from("hadiths").select("*").in("id", ids);
  return data ?? [];
}
