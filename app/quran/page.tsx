import Link from "next/link";
import { getServerT } from "@/lib/i18n-server";

export default async function QuranPage() {
  const { t } = await getServerT();
  return (
    <section className="mx-auto max-w-xl px-6 py-16 text-center">
      <div className="text-6xl" aria-hidden>
        📖
      </div>
      <h1 className="mt-4 text-3xl font-extrabold" style={{ color: "var(--wird-green)" }}>
        {t("nav.quran")}
      </h1>
      <p className="mt-4 wird-muted">{t("common.comingSoon")}</p>
      <Link href="/" className="wird-btn-outline mt-8">
        ←
      </Link>
    </section>
  );
}
