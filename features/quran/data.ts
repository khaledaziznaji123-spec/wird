export type Ayah = {
  number: number;
  text: string;
  audio: string;
  numberInSurah: number;
  surahNumber: number;
  surahName: string;
};

export const QURAN_PAGES = 604;

export const RECITERS = [
  { id: "ar.alafasy", name_ar: "مشاري العفاسي", name_en: "Mishary Alafasy" },
  { id: "ar.husary", name_ar: "محمود الحصري", name_en: "Al-Husary" },
  { id: "ar.minshawi", name_ar: "محمد المنشاوي", name_en: "Al-Minshawi" },
  { id: "ar.mahermuaiqly", name_ar: "ماهر المعيقلي", name_en: "Maher Al-Muaiqly" },
] as const;

/** Fetches one Madani-Mushaf page (Uthmani text + Alafasy audio) from Al Quran Cloud. */
export async function getQuranPage(
  page: number,
): Promise<{ page: number; ayahs: Ayah[] } | null> {
  const p = Math.min(QURAN_PAGES, Math.max(1, page));
  const res = await fetch(
    `https://api.alquran.cloud/v1/page/${p}/ar.alafasy`,
    { next: { revalidate: 604800 } }, // cache a week
  );
  if (!res.ok) return null;
  const j = await res.json();
  const ayahs: Ayah[] = (j?.data?.ayahs ?? []).map(
    (a: {
      number: number;
      text: string;
      audio: string;
      numberInSurah: number;
      surah: { number: number; name: string };
    }) => ({
      number: a.number,
      text: a.text,
      audio: a.audio,
      numberInSurah: a.numberInSurah,
      surahNumber: a.surah.number,
      surahName: a.surah.name,
    }),
  );
  return { page: p, ayahs };
}
