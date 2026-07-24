import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n-server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { t } = await getServerT();

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <div className="mb-4 text-center text-5xl" aria-hidden>
        👤
      </div>
      <h1
        className="mb-6 text-center text-3xl font-extrabold"
        style={{ color: "var(--wird-green)" }}
      >
        {t("nav.profile")}
      </h1>

      <div className="wird-card p-5">
        <p className="text-sm wird-muted">✉️</p>
        <p className="text-lg font-semibold">{user.email}</p>
      </div>

      <p className="mt-6 text-center text-sm wird-muted">
        {t("common.comingSoon")}
      </p>

      <div className="mt-8 text-center">
        <Link href="/support" className="wird-btn-outline">
          {t("common.support")}
        </Link>
      </div>
    </section>
  );
}
