import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n-server";
import { getStreak } from "@/features/streak/data";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { t } = await getServerT();
  const streak = await getStreak();
  const { count: favCount } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const stats = [
    { em: "🔥", value: streak.current, label: t("streak.current") },
    { em: "🏆", value: streak.longest, label: t("streak.longest") },
    { em: "📅", value: streak.totalDays, label: t("streak.days") },
    { em: "⭐", value: favCount ?? 0, label: t("nav.hadith") },
  ];

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <div className="mb-4 text-center text-5xl" aria-hidden>
        👤
      </div>
      <h1 className="mb-6 text-center text-3xl font-extrabold" style={{ color: "var(--wird-green)" }}>
        {t("nav.profile")}
      </h1>

      <div className="wird-card mb-6 p-5">
        <p className="text-sm wird-muted">✉️</p>
        <p className="text-lg font-semibold break-all">{user.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="wird-card p-4 text-center">
            <div className="text-3xl">{s.em}</div>
            <div className="text-2xl font-extrabold" style={{ color: "var(--wird-green)" }}>
              {s.value}
            </div>
            <div className="text-xs wird-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/support" className="wird-btn-outline">
          {t("common.support")}
        </Link>
      </div>
    </section>
  );
}
