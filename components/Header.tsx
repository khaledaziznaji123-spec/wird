"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n-context";
import LanguageToggle from "./LanguageToggle";
import { signout } from "@/features/auth/actions";

export default function Header({ userEmail }: { userEmail: string | null }) {
  const t = useT();
  return (
    <header className="flex w-full items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>
          🕌
        </span>
        <span className="text-xl font-bold" style={{ color: "var(--wird-gold)" }}>
          {t("app.name")}
        </span>
      </Link>

      <nav className="flex items-center gap-2 text-sm">
        {userEmail ? (
          <>
            <Link
              href="/profile"
              className="rounded-full px-3 py-1.5 hover:bg-white/10"
            >
              {t("nav.profile")}
            </Link>
            <form action={signout}>
              <button
                type="submit"
                className="rounded-full border border-white/20 px-3 py-1.5 hover:bg-white/10"
              >
                {t("auth.logout")}
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-full px-3 py-1.5 hover:bg-white/10"
            >
              {t("auth.login")}
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-3 py-1.5 font-semibold text-black"
              style={{ backgroundColor: "var(--wird-gold)" }}
            >
              {t("auth.signup")}
            </Link>
          </>
        )}
        <LanguageToggle />
      </nav>
    </header>
  );
}
