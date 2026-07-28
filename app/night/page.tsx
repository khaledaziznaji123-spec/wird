import Link from "next/link";
import { getServerT } from "@/lib/i18n-server";
import SurahPlayer, { type Track } from "@/features/audio/SurahPlayer";

const NIGHT: Track[] = [
  { surah: 67, ar: "سورة الملك", en: "Al-Mulk" },
  { surah: 55, ar: "سورة الرحمن", en: "Ar-Rahman" },
  { surah: 36, ar: "سورة يس", en: "Ya-Sin" },
  { surah: 32, ar: "سورة السجدة", en: "As-Sajdah" },
  { surah: 56, ar: "سورة الواقعة", en: "Al-Waqi'ah" },
  { surah: 18, ar: "سورة الكهف", en: "Al-Kahf" },
];

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
      <SurahPlayer tracks={NIGHT} mode="pick" showTimer />
    </section>
  );
}
