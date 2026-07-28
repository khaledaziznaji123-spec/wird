import Link from "next/link";
import { getServerT } from "@/lib/i18n-server";
import books from "@/data/books.json";

export default async function BooksPage() {
  const { t, locale } = await getServerT();
  return (
    <section className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/" className="mb-4 inline-block text-sm wird-muted hover:underline">
        ← {t("nav.home")}
      </Link>
      <h1 className="mb-2 text-center text-3xl font-extrabold" style={{ color: "var(--wird-green)" }}>
        📚 {t("books.title")}
      </h1>
      <p className="mb-6 text-center wird-muted">{t("books.intro")}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {books.map((b) => (
          <Link key={b.slug} href={`/books/${b.slug}`} className="wird-card flex items-center gap-3 p-4 font-bold">
            <span className="text-3xl">{b.emoji}</span>
            {locale === "ar" ? b.title_ar : b.title_en}
          </Link>
        ))}
      </div>
    </section>
  );
}
