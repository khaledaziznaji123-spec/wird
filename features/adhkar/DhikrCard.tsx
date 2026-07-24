"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n-context";
import type { Dhikr } from "./data";

export default function DhikrCard({ dhikr }: { dhikr: Dhikr }) {
  const t = useT();
  const [remaining, setRemaining] = useState(dhikr.repeat_count);
  const [showProof, setShowProof] = useState(false);
  const done = remaining <= 0;

  return (
    <div
      className={`rounded-2xl border p-5 transition-colors ${
        done
          ? "border-green-500/40 bg-green-500/10"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <p className="text-2xl leading-loose">{dhikr.arabic_text}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setRemaining((r) => Math.max(0, r - 1))}
          disabled={done}
          className="rounded-full px-5 py-2 font-bold text-black transition-opacity disabled:opacity-60"
          style={{ backgroundColor: done ? "#22c55e" : "var(--wird-gold)" }}
        >
          {done ? `✓ ${t("adhkar.done")}` : `${t("adhkar.tap")} · ${remaining}`}
        </button>

        {dhikr.count_description ? (
          <span className="text-xs opacity-60">{dhikr.count_description}</span>
        ) : null}

        {done ? (
          <button
            type="button"
            onClick={() => setRemaining(dhikr.repeat_count)}
            className="text-xs underline opacity-70"
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
            className="text-sm underline"
            style={{ color: "var(--wird-gold)" }}
          >
            📜 {showProof ? t("adhkar.hideProof") : t("adhkar.showProof")}
          </button>
          {showProof ? (
            <div className="mt-2 space-y-2 rounded-lg bg-black/20 p-3 text-sm leading-relaxed opacity-90">
              <p>{dhikr.source_proof}</p>
              {dhikr.virtue ? (
                <p className="opacity-70">✨ {dhikr.virtue}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
