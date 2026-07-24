"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n-context";
import LanguageToggle from "./LanguageToggle";
import { signout } from "@/features/auth/actions";

export default function Header({ userEmail }: { userEmail: string | null }) {
  const t = useT();

  return (
    <header
      className="flex w-full items-center justify-between gap-3 px-4 py-3"
      style={{
        background: "var(--wird-card)",
        borderBottom: "1px solid var(--wird-border)",
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>
          🕌
        </span>
        <span
          className="text-xl font-extrabold"
          style={{ color: "var(--wird-green)" }}
        >
          {t("app.name")}
        </span>
      </Link>

      <nav className="flex items-center gap-2 text-sm">
        {userEmail ? (
          <form
            action={signout}
            onSubmit={(e) => {
              if (!confirm(t("auth.confirmLogout"))) e.preventDefault();
            }}
          >
            <button
              type="submit"
              className="rounded-full px-3 py-1.5 font-semibold"
              style={{ border: "1px solid var(--wird-border)" }}
            >
              {t("auth.logout")}
            </button>
          </form>
        ) : null}
        <LanguageToggle />
      </nav>
    </header>
  );
}
