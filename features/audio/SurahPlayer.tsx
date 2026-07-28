"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n, useT } from "@/lib/i18n-context";

export type Track = { surah: number; ar: string; en: string };

const RECITERS = [
  { id: "ar.alafasy", ar: "مشاري العفاسي", en: "Mishary Alafasy" },
  { id: "ar.abdulbasitmurattal", ar: "عبد الباسط", en: "Abdul Basit" },
];
const surahUrl = (reciter: string, surah: number) =>
  `https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${surah}.mp3`;

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function SurahPlayer({
  tracks,
  mode,
  showTimer = false,
}: {
  tracks: Track[];
  mode: "sequence" | "pick";
  showTimer?: boolean;
}) {
  const t = useT();
  const { locale } = useI18n();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [reciter, setReciter] = useState(RECITERS[0].id);
  const [idx, setIdx] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [timerMin, setTimerMin] = useState(0);
  const timerRef = useRef<number | null>(null);

  function playIdx(i: number) {
    if (i < 0 || i >= tracks.length) {
      setIdx(null);
      return;
    }
    setIdx(i);
    const el = audioRef.current;
    if (el) {
      el.src = surahUrl(reciter, tracks[i].surah);
      el.play().catch(() => setIdx(null));
    }
  }
  function toggleSeq() {
    if (idx === null) playIdx(0);
    else {
      audioRef.current?.pause();
      setIdx(null);
    }
  }
  function onEnded() {
    if (mode === "sequence") playIdx((idx ?? 0) + 1);
    else setIdx(null);
  }

  function startTimer(min: number) {
    setTimerMin(min);
    if (timerRef.current) clearInterval(timerRef.current);
    if (min <= 0) {
      setRemaining(0);
      return;
    }
    setRemaining(min * 60);
    timerRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          audioRef.current?.pause();
          setIdx(null);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }
  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const name = (tr: Track) => (locale === "ar" ? tr.ar : tr.en);

  return (
    <div className="flex flex-col gap-4">
      <select
        className="wird-input text-sm"
        value={reciter}
        onChange={(e) => {
          setReciter(e.target.value);
          audioRef.current?.pause();
          setIdx(null);
        }}
      >
        {RECITERS.map((r) => (
          <option key={r.id} value={r.id}>
            🎙️ {locale === "ar" ? r.ar : r.en}
          </option>
        ))}
      </select>

      {showTimer ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold wird-muted">🌙 {t("night.timer")}:</span>
          {[0, 10, 20, 30, 45].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => startTimer(m)}
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={
                timerMin === m
                  ? { background: "var(--wird-green)", color: "#fff" }
                  : { border: "1px solid var(--wird-border)" }
              }
            >
              {m === 0 ? t("night.off") : `${m} ${t("night.min")}`}
            </button>
          ))}
          {remaining > 0 ? (
            <span className="text-xs wird-muted">
              {t("night.stops")} {fmt(remaining)}
            </span>
          ) : null}
        </div>
      ) : null}

      {mode === "sequence" ? (
        <>
          <button type="button" onClick={toggleSeq} className="wird-btn text-center">
            {idx !== null ? `⏸ ${t("ruqya.pause")}` : `▶ ${t("ruqya.play")}`}
          </button>
          <div className="flex flex-col gap-2">
            {tracks.map((tr, i) => (
              <div
                key={tr.surah}
                className="wird-card p-3 text-center font-semibold"
                style={idx === i ? { borderColor: "var(--wird-green)", background: "#f1f8f3" } : undefined}
              >
                {idx === i ? "🔊 " : ""}
                {name(tr)}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {tracks.map((tr, i) => (
            <button
              key={tr.surah}
              type="button"
              onClick={() => (idx === i ? toggleSeq() : playIdx(i))}
              className="wird-card p-4 text-center font-bold"
              style={idx === i ? { borderColor: "var(--wird-green)", background: "#f1f8f3" } : undefined}
            >
              <div className="text-2xl">{idx === i ? "⏸" : "▶"}</div>
              {name(tr)}
            </button>
          ))}
        </div>
      )}

      <audio ref={audioRef} onEnded={onEnded} hidden />
    </div>
  );
}
