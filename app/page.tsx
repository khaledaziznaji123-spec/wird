"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n-context";

export default function Home() {
  const t = useT();
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-16 text-center">
      <div className="text-6xl" aria-hidden>
        🕌
      </div>
      <h1
        className="text-4xl font-extrabold tracking-tight"
        style={{ color: "var(--wird-gold)" }}
      >
        {t("home.welcome")}
      </h1>
      <p className="max-w-md text-lg leading-relaxed opacity-80">
        {t("home.intro")}
      </p>
      <Link
        href="/adhkar"
        className="mt-2 rounded-full px-8 py-3 text-lg font-bold text-black transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--wird-gold)" }}
      >
        📿 {t("adhkar.open")}
      </Link>

      <div className="mt-2 rounded-xl border border-white/10 px-5 py-3 text-sm opacity-70">
        {t("home.streak")} 🔥
      </div>
    </section>
  );
}
