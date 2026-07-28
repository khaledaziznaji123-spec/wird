import Link from "next/link";
import { getServerT } from "@/lib/i18n-server";
import SupportForm from "@/features/support/SupportForm";

export default async function SupportPage() {
  const { t } = await getServerT();
  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <Link href="/" className="mb-4 inline-block text-sm wird-muted hover:underline">
        ← {t("nav.home")}
      </Link>
      <div className="mb-2 text-center text-5xl" aria-hidden>
        🆘
      </div>
      <h1 className="mb-2 text-center text-3xl font-extrabold" style={{ color: "var(--wird-green)" }}>
        {t("common.support")}
      </h1>
      <p className="mb-6 text-center wird-muted">{t("support.intro")}</p>
      <SupportForm />
    </section>
  );
}
