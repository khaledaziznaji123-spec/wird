"use client";

import { useActionState } from "react";
import { submitSupport, type SupportState } from "./actions";
import { useT } from "@/lib/i18n-context";

export default function SupportForm() {
  const t = useT();
  const [state, formAction, pending] = useActionState<SupportState, FormData>(
    submitSupport,
    {},
  );

  if (state.ok) {
    return (
      <div className="wird-card p-6 text-center">
        <div className="text-4xl">✅</div>
        <p className="mt-3 font-semibold" style={{ color: "var(--wird-green)" }}>
          {t("support.success")}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="wird-card flex flex-col gap-4 p-6 text-start">
      <label className="flex flex-col gap-1 text-sm font-semibold">
        {t("support.name")}
        <input name="name" className="wird-input" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        {t("support.email")}
        <input name="email" type="email" className="wird-input" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        {t("support.message")}
        <textarea name="message" required rows={4} className="wird-input" />
      </label>
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      ) : null}
      <button type="submit" disabled={pending} className="wird-btn-gold text-center disabled:opacity-60">
        {pending ? t("support.sending") : t("support.send")}
      </button>
    </form>
  );
}
