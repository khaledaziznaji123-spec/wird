"use client";

import { useRouter } from "next/navigation";
import { useI18n, useT } from "@/lib/i18n-context";
import { LOCALE_COOKIE } from "@/lib/i18n";

export default function LanguageToggle() {
  const { locale } = useI18n();
  const t = useT();
  const router = useRouter();
  const next = locale === "ar" ? "en" : "ar";

  function toggle() {
    // Persist for a year; the server layout reads this cookie to pick the locale.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("common.toggleAria")}
      className="rounded-full px-4 py-1.5 text-sm font-semibold"
      style={{ border: "1px solid var(--wird-border)", color: "var(--wird-green)" }}
    >
      {t("common.language")}
    </button>
  );
}
