"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n-context";
import LanguageToggle from "./LanguageToggle";
import { signout } from "@/features/auth/actions";

export default function Header({ userEmail }: { userEmail: string | null }) {
  const t = useT();
  const pathname = usePathname();
  const onLogin = pathname === "/login";
  const orange = { backgroundColor: "var(--wird-gold)", color: "#000" };

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
            <form
              action={signout}
              onSubmit={(e) => {
                if (!confirm(t("auth.confirmLogout"))) e.preventDefault();
              }}
            >
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
            {/* The orange (primary) highlight follows the page you're on:
                on /login the Log in button is orange, otherwise Sign up is. */}
            <Link
              href="/login"
              className="rounded-full px-3 py-1.5 font-semibold hover:bg-white/10"
              style={onLogin ? orange : undefined}
            >
              {t("auth.login")}
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-3 py-1.5 font-semibold hover:bg-white/10"
              style={onLogin ? undefined : orange}
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
