import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n-server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { t } = await getServerT();

  // Logged OUT → centered choice: create account or log in.
  if (!user) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-20 text-center">
        <div className="text-7xl" aria-hidden>
          🕌
        </div>
        <h1
          className="text-4xl font-extrabold tracking-tight"
          style={{ color: "var(--wird-green)" }}
        >
          {t("home.welcome")}
        </h1>
        <p className="max-w-md text-lg leading-relaxed wird-muted">
          {t("home.intro")}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup" className="wird-btn-gold">
            {t("auth.signup")}
          </Link>
          <Link href="/login" className="wird-btn-outline">
            {t("auth.login")}
          </Link>
        </div>
      </section>
    );
  }

  // Logged IN → the four main sections.
  const tiles = [
    { href: "/quran", em: "📖", label: t("nav.quran") },
    { href: "/adhkar", em: "📿", label: t("nav.adhkar") },
    { href: "/hadith", em: "📜", label: t("nav.hadith") },
    { href: "/profile", em: "👤", label: t("nav.profile") },
  ];

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <h1
        className="mb-1 text-center text-3xl font-extrabold"
        style={{ color: "var(--wird-green)" }}
      >
        {t("home.welcome")}
      </h1>
      <p className="mb-8 text-center wird-muted">{t("home.chooseSection")}</p>

      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href} className="wird-tile">
            <span className="em" aria-hidden>
              {tile.em}
            </span>
            {tile.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
