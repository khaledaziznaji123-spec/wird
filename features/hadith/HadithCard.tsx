"use client";

import { useState, useTransition } from "react";
import { toggleFavorite } from "./actions";
import { useT } from "@/lib/i18n-context";
import type { Hadith } from "./data";

export default function HadithCard({
  hadith,
  initialSaved,
  canSave,
}: {
  hadith: Hadith;
  initialSaved: boolean;
  canSave: boolean;
}) {
  const t = useT();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function onToggle() {
    setSaved((s) => !s); // optimistic
    startTransition(async () => {
      const res = await toggleFavorite(hadith.id);
      if (res.ok) setSaved(res.saved);
    });
  }

  return (
    <div className="wird-card p-5">
      <p className="text-xl leading-loose">{hadith.arabic_text}</p>
      {hadith.english_text ? (
        <p className="mt-3 text-sm wird-muted" dir="ltr">
          {hadith.english_text}
        </p>
      ) : null}
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold" style={{ color: "var(--wird-green)" }}>
          📖 {hadith.reference}
        </span>
        {canSave ? (
          <button
            type="button"
            onClick={onToggle}
            disabled={pending}
            className="rounded-full px-3 py-1.5 text-sm font-semibold"
            style={{ border: "1px solid var(--wird-border)" }}
          >
            {saved ? `⭐ ${t("hadith.saved")}` : `☆ ${t("hadith.save")}`}
          </button>
        ) : null}
      </div>
    </div>
  );
}
