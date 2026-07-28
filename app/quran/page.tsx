import Link from "next/link";
import { getQuranPage } from "@/features/quran/data";
import QuranReader from "@/features/quran/QuranReader";
import { createClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n-server";

export default async function QuranPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let page = parseInt(pageParam ?? "", 10);
  if (!Number.isFinite(page)) {
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("last_quran_page")
        .eq("id", user.id)
        .maybeSingle();
      page = data?.last_quran_page ?? 1;
    } else {
      page = 1;
    }
  }
  page = Math.min(604, Math.max(1, page));

  const data = await getQuranPage(page);

  // Remember the last page the user read.
  if (user) {
    await supabase.from("profiles").update({ last_quran_page: page }).eq("id", user.id);
  }

  const { t } = await getServerT();

  return (
    <section className="mx-auto max-w-2xl px-4 py-6">
      <Link href="/" className="mb-4 inline-block text-sm wird-muted hover:underline">
        ← {t("nav.home")}
      </Link>
      <h1 className="mb-4 text-2xl font-extrabold" style={{ color: "var(--wird-green)" }}>
        📖 {t("nav.quran")}
      </h1>
      {data ? (
        <QuranReader page={page} ayahs={data.ayahs} />
      ) : (
        <p className="wird-muted">{t("quran.error")}</p>
      )}
    </section>
  );
}
