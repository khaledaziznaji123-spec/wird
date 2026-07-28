import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n-server";
import { getStreak } from "@/features/streak/data";
import PrayerTimes from "@/features/home/PrayerTimes";
import SetupPermissions from "@/features/home/SetupPermissions";
import QiblaCompass from "@/features/qibla/QiblaCompass";
import SurahPlayer from "@/features/audio/SurahPlayer";
import { RUQYA_TRACKS, NIGHT_TRACKS } from "@/features/audio/tracks";
import books from "@/data/books.json";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { t, locale } = await getServerT();

  // Logged OUT → centered choice: create account or log in.
  if (!user) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-20 text-center">
        <div className="text-7xl" aria-hidden>
          🕌
        </div>
        <h1
          className="text-4xl font-extrabold tracking-tight"
          style={{ color: "var(--wird-green)" }}
        >
          {t("home.welcome")}
        </h1>
        <p className="max-w-md text-lg leading-relaxed wird-muted">
          {t("home.intro")}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup" className="wird-btn-gold">
            {t("auth.signup")}
          </Link>
          <Link href="/login" className="wird-btn-outline">
            {t("auth.login")}
          </Link>
        </div>
      </section>
    );
  }

  // Logged IN → a scrollable dashboard with every feature laid out.
  const streak = await getStreak();
  const heading = "mb-3 text-lg font-extrabold";

  return (
    <section className="mx-auto max-w-2xl px-5 py-8">
      <h1
        className="mb-1 text-center text-3xl font-extrabold"
        style={{ color: "var(--wird-green)" }}
      >
        {t("home.welcome")}
      </h1>

      <div className="mx-auto mb-6 mt-3 max-w-xs rounded-full py-2 text-center font-bold"
        style={{ background: "#f1f8f3", border: "1px solid var(--wird-border)" }}>
        {streak.current > 0
          ? `🔥 ${streak.current} ${t("streak.banner")}`
          : `🌱 ${t("streak.none")}`}
      </div>

      <SetupPermissions />

      <div className="mb-6">
        <PrayerTimes />
      </div>

      <div className="wird-card mb-6 p-5">
        <h3 className={heading} style={{ color: "var(--wird-green)" }}>
          🧭 {t("qibla.title")}
        </h3>
        <QiblaCompass />
      </div>

      <div className="wird-card mb-6 p-5">
        <h3 className={heading} style={{ color: "var(--wird-green)" }}>
          🛡️ {t("ruqya.title")}
        </h3>
        <p className="mb-3 text-sm wird-muted">{t("ruqya.intro")}</p>
        <SurahPlayer tracks={RUQYA_TRACKS} mode="sequence" />
      </div>

      <div className="wird-card mb-6 p-5">
        <h3 className={heading} style={{ color: "var(--wird-green)" }}>
          🌙 {t("night.title")}
        </h3>
        <p className="mb-3 text-sm wird-muted">{t("night.intro")}</p>
        <SurahPlayer tracks={NIGHT_TRACKS} mode="pick" showTimer />
      </div>

      <div className="mb-6">
        <h3 className={heading} style={{ color: "var(--wird-green)" }}>
          📚 {t("books.title")}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {books.map((b) => (
            <a
              key={b.slug}
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="wird-card flex items-center gap-3 p-4"
            >
              <span className="text-3xl">{b.emoji}</span>
              <span className="font-bold">
                {locale === "ar" ? b.title_ar : b.title_en} ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
