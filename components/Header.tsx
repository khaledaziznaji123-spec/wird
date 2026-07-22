"use client";

import { useT } from "@/lib/i18n-context";
import LanguageToggle from "./LanguageToggle";

export default function Header() {
  const t = useT();
  return (
    <header className="flex w-full items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>
          🕌
        </span>
        <span
          className="text-xl font-bold"
          style={{ color: "var(--wird-gold)" }}
        >
          {t("app.name")}
        </span>
      </div>
      <LanguageToggle />
    </header>
  );
}
