"use client";

import { Fragment, useRef, useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n-context";
import { QURAN_PAGES, type Ayah } from "./data";

const toArabicNum = (n: number) => n.toLocaleString("ar-EG");

export default function QuranReader({
  page,
  ayahs,
}: {
  page: number;
  ayahs: Ayah[];
}) {
  const t = useT();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<number | null>(null);

  function playFrom(i: number) {
    if (i >= ayahs.length) {
      setPlaying(null);
      return;
    }
    setPlaying(i);
    const el = audioRef.current;
    if (el) {
      el.src = ayahs[i].audio;
      el.play().catch(() => setPlaying(null));
    }
  }
  function toggle() {
    if (playing === null) playFrom(0);
    else {
      audioRef.current?.pause();
      setPlaying(null);
    }
  }

  const nav = (
    <div className="mb-4 flex items-center justify-between gap-2">
      <Link
        href={`/quran?page=${Math.max(1, page - 1)}`}
        className="wird-btn-outline"
        aria-disabled={page <= 1}
      >
        ‹ {t("quran.prev")}
      </Link>
      <button type="button" onClick={toggle} className="wird-btn">
        {playing !== null ? `⏸ ${t("quran.pause")}` : `▶ ${t("quran.play")}`}
      </button>
      <Link
        href={`/quran?page=${Math.min(QURAN_PAGES, page + 1)}`}
        className="wird-btn-outline"
        aria-disabled={page >= QURAN_PAGES}
      >
        {t("quran.next")} ›
      </Link>
    </div>
  );

  let lastSurah = -1;

  return (
    <div>
      {nav}

      <p className="mb-3 text-center text-sm wird-muted">
        {t("quran.page")} {toArabicNum(page)} / {toArabicNum(QURAN_PAGES)}
      </p>

      <div
        className="wird-card p-6 text-center leading-[2.6]"
        style={{ fontFamily: '"Amiri", "Scheherazade New", "Traditional Arabic", serif', fontSize: "1.7rem" }}
      >
        {ayahs.map((a, i) => {
          const header =
            a.surahNumber !== lastSurah ? ((lastSurah = a.surahNumber), true) : false;
          return (
            <Fragment key={a.number}>
              {header ? (
                <div
                  className="my-4 rounded-lg py-2 text-lg font-bold"
                  style={{ background: "#f1f8f3", color: "var(--wird-green)" }}
                >
                  {a.surahName}
                </div>
              ) : null}
              <span
                style={
                  playing === i
                    ? { background: "#fdf3d3", borderRadius: "4px" }
                    : undefined
                }
              >
                {a.text}
              </span>
              <span style={{ color: "var(--wird-gold)", fontSize: "1.2rem" }}>
                {" "}
                ﴿{toArabicNum(a.numberInSurah)}﴾{" "}
              </span>
            </Fragment>
          );
        })}
      </div>

      <div className="mt-4">{nav}</div>

      <audio
        ref={audioRef}
        onEnded={() => playFrom((playing ?? 0) + 1)}
        hidden
      />
    </div>
  );
}
