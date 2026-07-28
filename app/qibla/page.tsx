import Link from "next/link";
import { getServerT } from "@/lib/i18n-server";
import QiblaCompass from "@/features/qibla/QiblaCompass";

export default async function QiblaPage() {
  const { t } = await getServerT();
  return (
    <section className="mx-auto max-w-md px-6 py-10">
      <Link href="/" className="mb-4 inline-block text-sm wird-muted hover:underline">
        ← {t("nav.home")}
      </Link>
      <h1 className="mb-6 text-center text-3xl font-extrabold" style={{ color: "var(--wird-green)" }}>
        🧭 {t("qibla.title")}
      </h1>
      <QiblaCompass />
    </section>
  );
}
