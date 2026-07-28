"use client";

import { useEffect, useState, useTransition } from "react";
import { useT } from "@/lib/i18n-context";
import { toggleAdhkarFavorite } from "./favActions";
import type { Dhikr } from "./data";

export default function DhikrCard({
  dhikr,
  index,
  onDoneChange,
  isFav = false,
  canFav = false,
}: {
  dhikr: Dhikr;
  index?: number;
  onDoneChange?: (index: number, done: boolean) => void;
  isFav?: boolean;
  canFav?: boolean;
}) {
  const t = useT();
  const [remaining, setRemaining] = useState(dhikr.repeat_count);
  const [showProof, setShowProof] = useState(false);
  const [saved, setSaved] = useState(isFav);
  const [, startFav] = useTransition();
  const done = remaining <= 0;

  useEffect(() => {
    if (onDoneChange && index !== undefined) onDoneChange(index, done);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function onFav() {
    setSaved((s) => !s);
    startFav(async () => {
      const r = await toggleAdhkarFavorite(dhikr.id);
      if (r.ok) setSaved(r.saved);
    });
  }

  return (
    <div
      className="wird-card p-5"
      style={done ? { borderColor: "var(--wird-green)", background: "#f1f8f3" } : undefined}
    >
      {canFav ? (
        <div className="mb-1 flex justify-end">
          <button
            type="button"
            onClick={onFav}
            aria-label="save"
            className="text-xl leading-none"
            title={saved ? t("adhkar.saved") : t("adhkar.save")}
          >
            {saved ? "⭐" : "☆"}
          </button>
        </div>
      ) : null}
      <p className="text-2xl leading-loose">{dhikr.arabic_text}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setRemaining((r) => Math.max(0, r - 1))}
          disabled={done}
          className="rounded-full px-5 py-2 font-bold text-white transition-opacity disabled:opacity-90"
          style={{ background: done ? "var(--wird-green)" : "var(--wird-gold)" }}
        >
          {done ? `✓ ${t("adhkar.done")}` : `${t("adhkar.tap")} · ${remaining}`}
        </button>

        {dhikr.count_description ? (
          <span className="text-xs wird-muted">{dhikr.count_description}</span>
        ) : null}

        {done ? (
          <button
            type="button"
            onClick={() => setRemaining(dhikr.repeat_count)}
            className="text-xs underline wird-muted"
          >
            {t("adhkar.reset")}
          </button>
        ) : null}
      </div>

      {dhikr.source_proof ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowProof((s) => !s)}
            className="text-sm font-semibold"
            style={{ color: "var(--wird-green)" }}
          >
            📜 {showProof ? t("adhkar.hideProof") : t("adhkar.showProof")}
          </button>
          {showProof ? (
            <div
              className="mt-2 space-y-2 rounded-lg p-3 text-sm leading-relaxed"
              style={{ background: "#f4f1e8", border: "1px solid var(--wird-border)" }}
            >
              <p>{dhikr.source_proof}</p>
              {dhikr.virtue ? <p className="wird-muted">✨ {dhikr.virtue}</p> : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
