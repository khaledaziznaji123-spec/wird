"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "./actions";
import { useT } from "@/lib/i18n-context";

export default function ProfileEditForm({
  displayName,
  language,
}: {
  displayName: string;
  language: string;
}) {
  const t = useT();
  const [state, action, pending] = useActionState<ProfileState, FormData>(
    updateProfile,
    {},
  );

  return (
    <form action={action} className="wird-card mt-6 flex flex-col gap-4 p-5 text-start">
      <h3 className="font-bold" style={{ color: "var(--wird-green)" }}>
        ✏️ {t("profileEdit.title")}
      </h3>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        {t("profileEdit.name")}
        <input name="display_name" defaultValue={displayName} maxLength={40} className="wird-input" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        {t("profileEdit.language")}
        <select name="language" defaultValue={language} className="wird-input">
          <option value="ar">العربية</option>
          <option value="en">English</option>
        </select>
      </label>
      {state.ok ? (
        <p className="text-sm font-semibold" style={{ color: "var(--wird-green)" }}>
          ✅ {t("profileEdit.saved")}
        </p>
      ) : null}
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="wird-btn-gold text-center disabled:opacity-60">
        {pending ? t("auth.loading") : t("profileEdit.save")}
      </button>
    </form>
  );
}
