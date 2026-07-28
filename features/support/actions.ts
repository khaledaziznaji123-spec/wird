"use server";

import { createClient } from "@/lib/supabase/server";

export type SupportState = { ok?: boolean; error?: string };

export async function submitSupport(
  _prev: SupportState,
  formData: FormData,
): Promise<SupportState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!message) return { error: "Please write a message." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("support_messages").insert({
    user_id: user?.id ?? null,
    name: name || null,
    email: email || null,
    message,
  });
  if (error) return { error: error.message };
  return { ok: true };
}
