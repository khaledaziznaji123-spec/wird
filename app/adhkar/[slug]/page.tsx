import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopic, getAdhkarForTopic } from "@/features/adhkar/data";
import DhikrCard from "@/features/adhkar/DhikrCard";
import { getServerT } from "@/lib/i18n-server";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) notFound();

  const [adhkar, { t, locale }] = await Promise.all([
    getAdhkarForTopic(topic.id),
    getServerT(),
  ]);

  return (
    <section className="mx-auto max-w-2xl px-5 py-8">
      <Link href="/adhkar" className="text-sm wird-muted hover:underline">
        ← {t("adhkar.back")}
      </Link>

      <h1
        className="mb-1 mt-3 text-3xl font-extrabold"
        style={{ color: "var(--wird-green)" }}
      >
        {slug === "morning" ? "🌅" : "🌙"}{" "}
        {locale === "ar" ? topic.name_ar : topic.name_en}
      </h1>
      <p className="mb-6 text-sm wird-muted">
        {adhkar.length} {t("adhkar.count")}
      </p>

      <div className="flex flex-col gap-4">
        {adhkar.map((d) => (
          <DhikrCard key={d.id} dhikr={d} />
        ))}
      </div>
    </section>
  );
}
