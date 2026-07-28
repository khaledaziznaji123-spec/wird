import Link from "next/link";
import { searchHadith, getFavoriteIds, getFavorites } from "@/features/hadith/data";
import HadithCard from "@/features/hadith/HadithCard";
import { createClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n-server";

const SUGGESTIONS = [
  { q: "patience", en: "Patience", ar: "الصبر" },
  { q: "mercy", en: "Mercy", ar: "الرحمة" },
  { q: "prayer", en: "Prayer", ar: "الصلاة" },
  { q: "charity", en: "Charity", ar: "الصدقة" },
  { q: "parents", en: "Parents", ar: "الوالدين" },
  { q: "knowledge", en: "Knowledge", ar: "العلم" },
  { q: "paradise", en: "Paradise", ar: "الجنة" },
  { q: "forgiveness", en: "Forgiveness", ar: "المغفرة" },
  { q: "kindness", en: "Kindness", ar: "الإحسان" },
  { q: "fasting", en: "Fasting", ar: "الصيام" },
  { q: "intention", en: "Intention", ar: "النية" },
  { q: "anger", en: "Anger", ar: "الغضب" },
  { q: "truth", en: "Truthfulness", ar: "الصدق" },
  { q: "trust", en: "Trust in Allah", ar: "التوكل" },
  { q: "neighbour", en: "Neighbours", ar: "الجار" },
  { q: "gratitude", en: "Gratitude", ar: "الشكر" },
  { q: "repentance", en: "Repentance", ar: "التوبة" },
  { q: "marriage", en: "Marriage", ar: "الزواج" },
  { q: "wealth", en: "Wealth", ar: "المال" },
  { q: "death", en: "Death", ar: "الموت" },
  { q: "dua", en: "Supplication", ar: "الدعاء" },
  { q: "brother", en: "Brotherhood", ar: "الأخوة" },
];

export default async function HadithPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const { t, locale } = await getServerT();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const canSave = !!user;

  const favIds = new Set(await getFavoriteIds());
  const results = query ? await searchHadith(query) : [];
  const favorites = query ? [] : await getFavorites();

  return (
    <section className="mx-auto max-w-2xl px-5 py-8">
      <Link href="/" className="mb-4 inline-block text-sm wird-muted hover:underline">
        ← {t("nav.home")}
      </Link>
      <h1 className="mb-2 text-3xl font-extrabold" style={{ color: "var(--wird-green)" }}>
        📜 {t("nav.hadith")}
      </h1>

      <form action="/hadith" className="mb-8 flex gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder={t("hadith.searchPlaceholder")}
          className="wird-input flex-1"
        />
        <button type="submit" className="wird-btn shrink-0">
          🔎
        </button>
      </form>

      {query ? (
        <>
          <p className="mb-4 text-sm wird-muted">
            {results.length} {t("hadith.results")} · “{query}”
          </p>
          {results.length === 0 ? (
            <p className="wird-muted">{t("hadith.noResults")}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((h) => (
                <HadithCard key={h.id} hadith={h} initialSaved={favIds.has(h.id)} canSave={canSave} />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="mb-3 text-sm font-bold wird-muted">{t("hadith.suggestions")}</h2>
          <div className="mb-8 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <Link
                key={s.q}
                href={`/hadith?q=${s.q}`}
                className="rounded-full px-4 py-2 text-sm font-semibold"
                style={{ background: "var(--wird-card)", border: "1px solid var(--wird-border)" }}
              >
                {locale === "ar" ? s.ar : s.en}
              </Link>
            ))}
          </div>

          <h2 className="mb-3 text-sm font-bold wird-muted">{t("hadith.favorites")}</h2>
          {favorites.length === 0 ? (
            <p className="wird-muted">{canSave ? t("hadith.empty") : t("hadith.searchPrompt")}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {favorites.map((h) => (
                <HadithCard key={h.id} hadith={h} initialSaved canSave={canSave} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
