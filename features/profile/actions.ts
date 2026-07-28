"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { LOCALE_COOKIE } from "@/lib/i18n";

export type ProfileState = { ok?: boolean; error?: string };

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const name = String(formData.get("display_name") ?? "").trim().slice(0, 40);
  const lang = String(formData.get("language") ?? "ar") === "en" ? "en" : "ar";

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: name || null, language: lang })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };

  // Keep the UI language in sync with the chosen preference.
  const store = await cookies();
  store.set(LOCALE_COOKIE, lang, { path: "/", maxAge: 31536000, sameSite: "lax" });

  revalidatePath("/", "layout");
  return { ok: true };
}
