import Link from "next/link";
import { getServerT } from "@/lib/i18n-server";
import SurahPlayer from "@/features/audio/SurahPlayer";
import { NIGHT_TRACKS } from "@/features/audio/tracks";

export default async function NightPage() {
  const { t } = await getServerT();
  return (
    <section className="mx-auto max-w-md px-6 py-10">
      <Link href="/" className="mb-4 inline-block text-sm wird-muted hover:underline">
        ← {t("nav.home")}
      </Link>
      <h1 className="mb-2 text-center text-3xl font-extrabold" style={{ color: "var(--wird-green)" }}>
        🌙 {t("night.title")}
      </h1>
      <p className="mb-6 text-center wird-muted">{t("night.intro")}</p>
      <SurahPlayer tracks={NIGHT_TRACKS} mode="pick" showTimer />
    </section>
  );
}
