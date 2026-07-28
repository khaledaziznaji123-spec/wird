import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerT } from "@/lib/i18n-server";
import books from "@/data/books.json";

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = books.find((b) => b.slug === slug);
  if (!book) notFound();

  const { t, locale } = await getServerT();
  const title = locale === "ar" ? book.title_ar : book.title_en;
  const body = locale === "ar" ? book.body_ar : book.body_en;

  return (
    <section className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/books" className="mb-4 inline-block text-sm wird-muted hover:underline">
        ← {t("books.title")}
      </Link>
      <div className="mb-4 text-center text-5xl">{book.emoji}</div>
      <h1 className="mb-6 text-center text-2xl font-extrabold" style={{ color: "var(--wird-green)" }}>
        {title}
      </h1>
      <div className="wird-card space-y-3 p-6 text-lg leading-relaxed">
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
