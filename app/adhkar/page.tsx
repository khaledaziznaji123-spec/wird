import Link from "next/link";
import { getTopics, searchAdhkar } from "@/features/adhkar/data";
import DhikrCard from "@/features/adhkar/DhikrCard";
import { getServerT } from "@/lib/i18n-server";

export default async function AdhkarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const { t, locale } = await getServerT();

  const results = query ? await searchAdhkar(query) : [];
  const topics = query ? [] : await getTopics();
  const routine = topics.filter((tp) => tp.kind === "routine");
  const situational = topics.filter((tp) => tp.kind !== "routine");

  return (
    <section className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="mb-2 text-3xl font-extrabold" style={{ color: "var(--wird-green)" }}>
        {t("adhkar.title")}
      </h1>
      <p className="mb-5 wird-muted">{t("adhkar.subtitle")}</p>

      {/* Topic search — plain GET form, no JS needed */}
      <form action="/adhkar" className="mb-8 flex gap-2">
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

      {query ? (
        <>
          <p className="mb-4 text-sm wird-muted">
            {results.length} {t("adhkar.results")} · “{query}”
          </p>
          {results.length === 0 ? (
            <p className="wird-muted">{t("adhkar.noResults")}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((d) => (
                <DhikrCard key={d.id} dhikr={d} />
              ))}
            </div>
          )}
          <div className="mt-8">
            <Link href="/adhkar" className="text-sm wird-muted hover:underline">
              ← {t("adhkar.back")}
            </Link>
          </div>
        </>
      ) : (
        <>
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
              <h2 className="mb-3 text-sm font-bold wird-muted">
                {t("adhkar.moreTopics")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {situational.map((tp) => (
                  <Link
                    key={tp.id}
                    href={`/adhkar/${tp.slug}`}
                    className="rounded-full px-4 py-2 text-sm font-semibold"
                    style={{
                      background: "var(--wird-card)",
                      border: "1px solid var(--wird-border)",
                    }}
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
