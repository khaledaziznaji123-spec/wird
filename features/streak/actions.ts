"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Marks a routine topic complete for the given local date. Idempotent
 * (PK on user/topic/date), so re-completing the same day is a no-op.
 */
export async function markDayComplete(topicId: number, localDate: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const date = /^\d{4}-\d{2}-\d{2}$/.test(localDate)
    ? localDate
    : new Date().toISOString().slice(0, 10);

  const { error } = await supabase
    .from("completions")
    .upsert(
      { user_id: user.id, topic_id: topicId, completed_date: date },
      { onConflict: "user_id,topic_id,completed_date", ignoreDuplicates: true },
    );

  revalidatePath("/", "layout");
  return { ok: !error };
}
