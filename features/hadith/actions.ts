"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Toggle a hadith in/out of the user's favorites. */
export async function toggleFavorite(hadithId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, saved: false };

  const { data: existing } = await supabase
    .from("favorites")
    .select("hadith_id")
    .eq("user_id", user.id)
    .eq("hadith_id", hadithId)
    .maybeSingle();

  let saved: boolean;
  if (existing) {
    await supabase.from("favorites").delete().eq("user_id", user.id).eq("hadith_id", hadithId);
    saved = false;
  } else {
    await supabase.from("favorites").insert({ user_id: user.id, hadith_id: hadithId });
    saved = true;
  }
  revalidatePath("/hadith");
  return { ok: true, saved };
}
