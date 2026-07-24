import Link from "next/link";
import { getTopics } from "@/features/adhkar/data";
import { getServerT } from "@/lib/i18n-server";

export default async function AdhkarPage() {
  const [topics, { t, locale }] = await Promise.all([getTopics(), getServerT()]);

  return (
    <section className="mx-auto max-w-2xl px-6 py-10">
      <h1
        className="mb-2 text-3xl font-extrabold"
        style={{ color: "var(--wird-gold)" }}
      >
        {t("adhkar.title")}
      </h1>
      <p className="mb-8 opacity-70">{t("adhkar.subtitle")}</p>

      {topics.length === 0 ? (
        <p className="opacity-60">{t("adhkar.empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map((tp) => (
            <Link
              key={tp.id}
              href={`/adhkar/${tp.slug}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-xl font-bold transition-colors hover:border-white/30"
            >
              {tp.slug === "morning" ? "🌅" : "🌙"}{" "}
              {locale === "ar" ? tp.name_ar : tp.name_en}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
