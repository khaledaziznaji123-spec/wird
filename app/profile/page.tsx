import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected route: only signed-in users may view this page.
  if (!user) redirect("/login");

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-4 text-2xl font-bold" style={{ color: "var(--wird-gold)" }}>
        🕌
      </h1>
      <div className="rounded-xl border border-white/10 p-5">
        <p className="text-sm opacity-70">Signed in as</p>
        <p className="text-lg font-semibold">{user.email}</p>
      </div>
      <p className="mt-6 text-sm opacity-60">
        Streak stats, favorites, and settings will appear here soon.
      </p>
    </section>
  );
}
