"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Toggle a dhikr in/out of the user's saved adhkar. */
export async function toggleAdhkarFavorite(adhkarId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, saved: false };

  const { data: existing } = await supabase
    .from("adhkar_favorites")
    .select("adhkar_id")
    .eq("user_id", user.id)
    .eq("adhkar_id", adhkarId)
    .maybeSingle();

  let saved: boolean;
  if (existing) {
    await supabase.from("adhkar_favorites").delete().eq("user_id", user.id).eq("adhkar_id", adhkarId);
    saved = false;
  } else {
    await supabase.from("adhkar_favorites").insert({ user_id: user.id, adhkar_id: adhkarId });
    saved = true;
  }
  revalidatePath("/adhkar", "layout");
  return { ok: true, saved };
}
