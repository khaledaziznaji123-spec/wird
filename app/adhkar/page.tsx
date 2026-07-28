import Link from "next/link";
import {
  getTopics,
  searchAdhkar,
  getAdhkarFavoriteIds,
  getFavoriteAdhkar,
} from "@/features/adhkar/data";
import DhikrCard from "@/features/adhkar/DhikrCard";
import { createClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n-server";

export default async function AdhkarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; fav?: string }>;
}) {
  const { q, fav } = await searchParams;
  const query = (q ?? "").trim();
  const showFav = fav === "1";
  const { t, locale } = await getServerT();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const canFav = !!user;
  const favIds = user ? await getAdhkarFavoriteIds() : [];
  const favSet = new Set(favIds);

  const results = query ? await searchAdhkar(query) : [];
  const saved = showFav ? await getFavoriteAdhkar() : [];
  const topics = query || showFav ? [] : await getTopics();
  const routine = topics.filter((tp) => tp.kind === "routine");
  const situational = topics.filter((tp) => tp.kind !== "routine");

  const cardList = (list: typeof results) => (
    <div className="flex flex-col gap-4">
      {list.map((d) => (
        <DhikrCard key={d.id} dhikr={d} isFav={favSet.has(d.id)} canFav={canFav} />
      ))}
    </div>
  );

  return (
    <section className="mx-auto max-w-2xl px-5 py-8">
      <Link href="/" className="mb-4 inline-block text-sm wird-muted hover:underline">
        ← {t("nav.home")}
      </Link>
      <h1 className="mb-2 text-3xl font-extrabold" style={{ color: "var(--wird-green)" }}>
        {t("adhkar.title")}
      </h1>
      <p className="mb-5 wird-muted">{t("adhkar.subtitle")}</p>

      <form action="/adhkar" className="mb-6 flex gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder={t("adhkar.searchPlaceholder")}
          className="wird-input flex-1"
        />
        <button type="submit" className="wird-btn shrink-0">
          🔎
        </button>
      </form>

      {showFav ? (
        <>
          <h2 className="mb-4 text-lg font-bold" style={{ color: "var(--wird-green)" }}>
            {t("adhkar.savedTopic")}
          </h2>
          {saved.length === 0 ? <p className="wird-muted">{t("adhkar.noSaved")}</p> : cardList(saved)}
          <div className="mt-8">
            <Link href="/adhkar" className="text-sm wird-muted hover:underline">
              ← {t("adhkar.back")}
            </Link>
          </div>
        </>
      ) : query ? (
        <>
          <p className="mb-4 text-sm wird-muted">
            {results.length} {t("adhkar.results")} · “{query}”
          </p>
          {results.length === 0 ? <p className="wird-muted">{t("adhkar.noResults")}</p> : cardList(results)}
          <div className="mt-8">
            <Link href="/adhkar" className="text-sm wird-muted hover:underline">
              ← {t("adhkar.back")}
            </Link>
          </div>
        </>
      ) : (
        <>
          {canFav ? (
            <Link
              href="/adhkar?fav=1"
              className="mb-6 inline-block rounded-full px-4 py-2 text-sm font-semibold"
              style={{ background: "var(--wird-card)", border: "1px solid var(--wird-gold)", color: "var(--wird-gold)" }}
            >
              {t("adhkar.savedTopic")}
            </Link>
          ) : null}

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            {routine.map((tp) => (
              <Link key={tp.id} href={`/adhkar/${tp.slug}`} className="wird-tile">
                <span className="em" aria-hidden>
                  {tp.slug === "morning" ? "🌅" : "🌙"}
                </span>
                {locale === "ar" ? tp.name_ar : tp.name_en}
              </Link>
            ))}
          </div>

          {situational.length > 0 ? (
            <>
              <h2 className="mb-3 text-sm font-bold wird-muted">{t("adhkar.moreTopics")}</h2>
              <div className="flex flex-wrap gap-2">
                {situational.map((tp) => (
                  <Link
                    key={tp.id}
                    href={`/adhkar/${tp.slug}`}
                    className="rounded-full px-4 py-2 text-sm font-semibold"
                    style={{ background: "var(--wird-card)", border: "1px solid var(--wird-border)" }}
                  >
                    {locale === "ar" ? tp.name_ar : tp.name_en}
                  </Link>
                ))}
              </div>
            </>
          ) : null}
        </>
      )}
    </section>
  );
}
