"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n-context";
import LanguageToggle from "./LanguageToggle";
import { signout } from "@/features/auth/actions";

export default function Header({ userEmail }: { userEmail: string | null }) {
  const t = useT();
  const pathname = usePathname();

  const links = [
    { href: "/", em: "🏠", label: t("nav.home") },
    { href: "/quran", em: "📖", label: t("nav.quran") },
    { href: "/adhkar", em: "📿", label: t("nav.adhkar") },
    { href: "/hadith", em: "📜", label: t("nav.hadith") },
    { href: "/profile", em: "👤", label: t("nav.profile") },
  ];
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "var(--wird-card)",
        borderBottom: "1px solid var(--wird-border)",
      }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        {/* Logo = home button */}
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <span className="text-2xl" aria-hidden>
            🕌
          </span>
          <span className="text-xl font-extrabold" style={{ color: "var(--wird-green)" }}>
            {t("app.name")}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {userEmail ? (
            <form
              action={signout}
              onSubmit={(e) => {
                if (!confirm(t("auth.confirmLogout"))) e.preventDefault();
              }}
            >
              <button
                type="submit"
                className="rounded-full px-3 py-1.5 text-sm font-semibold"
                style={{ border: "1px solid var(--wird-border)" }}
              >
                {t("auth.logout")}
              </button>
            </form>
          ) : null}
          <LanguageToggle />
        </div>
      </div>

      {/* Persistent 4-section nav (signed-in). Scrolls sideways on tiny screens. */}
      {userEmail ? (
        <nav
          className="flex items-center gap-1.5 overflow-x-auto px-3 pb-2 pt-0.5"
          style={{ borderTop: "1px solid var(--wird-border)" }}
        >
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className="flex shrink-0 items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-bold"
                style={
                  active
                    ? { background: "var(--wird-green)", color: "#fff" }
                    : { color: "var(--wird-fg)" }
                }
              >
                <span aria-hidden>{l.em}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
