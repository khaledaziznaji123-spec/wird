import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopic, getAdhkarForTopic, getAdhkarFavoriteIds } from "@/features/adhkar/data";
import AdhkarRunner from "@/features/adhkar/AdhkarRunner";
import { isTopicDoneToday } from "@/features/streak/data";
import { createClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n-server";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const utcToday = new Date().toISOString().slice(0, 10);
  const [adhkar, { t, locale }, alreadyDone, favIds] = await Promise.all([
    getAdhkarForTopic(topic.id),
    getServerT(),
    user ? isTopicDoneToday(topic.id, utcToday) : Promise.resolve(false),
    user ? getAdhkarFavoriteIds() : Promise.resolve([]),
  ]);

  const isRoutine = topic.kind === "routine";

  return (
    <section className="mx-auto max-w-2xl px-5 py-8">
      <Link href="/adhkar" className="text-sm wird-muted hover:underline">
        ← {t("adhkar.back")}
      </Link>

      <h1 className="mb-1 mt-3 text-3xl font-extrabold" style={{ color: "var(--wird-green)" }}>
        {slug === "morning" ? "🌅" : slug === "evening" ? "🌙" : "📿"}{" "}
        {locale === "ar" ? topic.name_ar : topic.name_en}
      </h1>
      <p className="mb-6 text-sm wird-muted">
        {adhkar.length} {t("adhkar.count")}
        {isRoutine ? ` · ${t("adhkar.finishForStreak")}` : ""}
      </p>

      <AdhkarRunner
        adhkar={adhkar}
        topicId={topic.id}
        isRoutine={isRoutine}
        isLoggedIn={!!user}
        alreadyDone={alreadyDone}
        favIds={favIds}
      />
    </section>
  );
}
