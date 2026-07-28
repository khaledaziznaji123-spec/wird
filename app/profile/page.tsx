import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n-server";
import { getStreak } from "@/features/streak/data";
import ShareRow from "@/features/profile/ShareRow";
import ProfileEditForm from "@/features/profile/ProfileEditForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { t, locale } = await getServerT();
  const streak = await getStreak();
  const { count: favCount } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, language")
    .eq("id", user.id)
    .maybeSingle();

  const emailName = (user.email ?? "?").split("@")[0];
  const displayName =
    profile?.display_name ||
    (user.user_metadata?.name as string | undefined) ||
    emailName;
  const initials = displayName.slice(0, 2).toUpperCase();
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString(locale === "ar" ? "ar" : "en", {
        year: "numeric",
        month: "long",
      })
    : "";

  const stats = [
    { em: "🔥", value: streak.current, label: t("streak.current") },
    { em: "🏆", value: streak.longest, label: t("streak.longest") },
    { em: "📅", value: streak.totalDays, label: t("streak.days") },
    { em: "⭐", value: favCount ?? 0, label: t("hadith.favorites") },
  ];

  return (
    <section className="mx-auto max-w-md px-6 py-8">
      <Link href="/" className="mb-4 inline-block text-sm wird-muted hover:underline">
        ← {t("nav.home")}
      </Link>

      {/* Identity */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-extrabold text-white"
          style={{ background: "var(--wird-green)" }}
        >
          {initials}
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--wird-green)" }}>
          {displayName}
        </h1>
        <p className="text-sm wird-muted break-all" dir="ltr">
          {user.email}
        </p>
        {memberSince ? (
          <p className="text-xs wird-muted">
            📅 {t("profile.memberSince")} {memberSince}
          </p>
        ) : null}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3">
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

      {/* Edit profile */}
      <ProfileEditForm
        displayName={profile?.display_name ?? ""}
        language={profile?.language ?? locale}
      />

      {/* Share + customer service */}
      <ShareRow />

      <div className="mt-8 text-center">
        <Link href="/support" className="wird-btn-outline">
          {t("common.support")}
        </Link>
      </div>
    </section>
  );
}
