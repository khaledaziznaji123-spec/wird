"use client";

import { Fragment, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n, useT } from "@/lib/i18n-context";
import { QURAN_PAGES, RECITERS, type Ayah } from "./data";

type NavSurah = { number: number; name: string; englishName: string; page: number };
type NavJuz = { number: number; page: number };

const toArabicNum = (n: number) => n.toLocaleString("ar-EG");

export default function QuranReader({
  page,
  ayahs,
  surahs,
  juzs,
}: {
  page: number;
  ayahs: Ayah[];
  surahs: NavSurah[];
  juzs: NavJuz[];
}) {
  const t = useT();
  const { locale } = useI18n();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [reciter, setReciter] = useState<string>(RECITERS[0].id);
  const [playing, setPlaying] = useState<number | null>(null);
  const [goto, setGoto] = useState("");

  const audioUrl = (i: number) =>
    `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayahs[i].number}.mp3`;

  function playFrom(i: number) {
    if (i >= ayahs.length) return setPlaying(null);
    setPlaying(i);
    const el = audioRef.current;
    if (el) {
      el.src = audioUrl(i);
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
  const go = (p: number) =>
    router.push(`/quran?page=${Math.min(QURAN_PAGES, Math.max(1, p))}`);

  const selectStyle = "wird-input text-sm";

  let lastSurah = -1;

  return (
    <div>
      {/* Jump controls */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <select
          className={selectStyle}
          value=""
          onChange={(e) => e.target.value && go(Number(e.target.value))}
        >
          <option value="">📖 {t("quran.surah")}</option>
          {surahs.map((s) => (
            <option key={s.number} value={s.page}>
              {s.number}. {locale === "ar" ? s.name : s.englishName}
            </option>
          ))}
        </select>

        <select
          className={selectStyle}
          value=""
          onChange={(e) => e.target.value && go(Number(e.target.value))}
        >
          <option value="">🧩 {t("quran.juz")}</option>
          {juzs.map((j) => (
            <option key={j.number} value={j.page}>
              {t("quran.juz")} {locale === "ar" ? toArabicNum(j.number) : j.number}
            </option>
          ))}
        </select>

        <input
          className={selectStyle}
          inputMode="numeric"
          placeholder={`${t("quran.page")} 1-604`}
          value={goto}
          onChange={(e) => setGoto(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && goto && go(Number(goto))}
        />
        <button type="button" className="wird-btn text-sm" onClick={() => goto && go(Number(goto))}>
          {t("quran.go")}
        </button>
      </div>

      {/* Playback controls */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <button type="button" onClick={() => go(page - 1)} className="wird-btn-outline">
          ‹
        </button>
        <select
          className={selectStyle + " flex-1"}
          value={reciter}
          onChange={(e) => {
            setReciter(e.target.value);
            setPlaying(null);
            audioRef.current?.pause();
          }}
        >
          {RECITERS.map((r) => (
            <option key={r.id} value={r.id}>
              🎙️ {locale === "ar" ? r.name_ar : r.name_en}
            </option>
          ))}
        </select>
        <button type="button" onClick={toggle} className="wird-btn">
          {playing !== null ? "⏸" : "▶"}
        </button>
        <button type="button" onClick={() => go(page + 1)} className="wird-btn-outline">
          ›
        </button>
      </div>

      {/* Mushaf-style full page */}
      <div
        style={{
          border: "3px double var(--wird-gold)",
          borderRadius: "14px",
          background: "#fffdf6",
          padding: "1.6rem 1.3rem",
          boxShadow: "0 3px 14px rgba(20,50,35,.08)",
        }}
      >
        <div
          className="leading-[2.7]"
          style={{
            fontFamily: '"Amiri", "Scheherazade New", "Traditional Arabic", serif',
            fontSize: "1.7rem",
            textAlign: "justify",
            textAlignLast: "center",
          }}
        >
          {ayahs.map((a, i) => {
            const header =
              a.surahNumber !== lastSurah ? ((lastSurah = a.surahNumber), true) : false;
            return (
              <Fragment key={a.number}>
                {header ? (
                  <div
                    className="my-3 rounded-lg py-2 text-center text-lg font-bold"
                    style={{
                      background: "var(--wird-green)",
                      color: "#fff",
                      textAlignLast: "center",
                    }}
                  >
                    ﴿ {a.surahName} ﴾
                  </div>
                ) : null}
                <span style={playing === i ? { background: "#fdf3d3", borderRadius: "4px" } : undefined}>
                  {a.text}
                </span>
                <span style={{ color: "var(--wird-gold)", fontSize: "1.2rem" }}>
                  {" ﴿" + toArabicNum(a.numberInSurah) + "﴾ "}
                </span>
              </Fragment>
            );
          })}
        </div>

        <div className="mt-4 border-t pt-2 text-center text-sm wird-muted" style={{ borderColor: "var(--wird-border)" }}>
          {t("quran.page")} {toArabicNum(page)} / {toArabicNum(QURAN_PAGES)}
        </div>
      </div>

      <audio ref={audioRef} onEnded={() => playFrom((playing ?? 0) + 1)} hidden />
    </div>
  );
}
