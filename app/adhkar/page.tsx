import Link from "next/link";
import { getTopics } from "@/features/adhkar/data";
import { getServerT } from "@/lib/i18n-server";

export default async function AdhkarPage() {
  const [topics, { t, locale }] = await Promise.all([getTopics(), getServerT()]);

  return (
    <section className="mx-auto max-w-2xl px-6 py-10">
      <h1
        className="mb-2 text-3xl font-extrabold"
        style={{ color: "var(--wird-green)" }}
      >
        {t("adhkar.title")}
      </h1>
      <p className="mb-8 wird-muted">{t("adhkar.subtitle")}</p>

      {topics.length === 0 ? (
        <p className="wird-muted">{t("adhkar.empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map((tp) => (
            <Link key={tp.id} href={`/adhkar/${tp.slug}`} className="wird-tile">
              <span className="em" aria-hidden>
                {tp.slug === "morning" ? "🌅" : "🌙"}
              </span>
              {locale === "ar" ? tp.name_ar : tp.name_en}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
