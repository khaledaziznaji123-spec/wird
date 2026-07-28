"use client";

import { useT } from "@/lib/i18n-context";

const APP_URL = "https://wird-beta.vercel.app";
const SHARE_TEXT = "Wird — your daily worship companion 🕌";
const PHONE = "971525134070";
const PHONE_DISPLAY = "+971 52 513 4070";

const SHARE_BTNS = [
  { id: "whatsapp", label: "WhatsApp", em: "🟢", bg: "#25D366" },
  { id: "snapchat", label: "Snapchat", em: "👻", bg: "#FFFC00" },
  { id: "instagram", label: "Instagram", em: "📸", bg: "#E1306C" },
  { id: "discord", label: "Discord", em: "🎮", bg: "#5865F2" },
];

export default function ShareRow() {
  const t = useT();

  function shareVia(app: string) {
    const full = `${SHARE_TEXT} ${APP_URL}`;
    if (app === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(full)}`, "_blank");
      return;
    }
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "Wird", text: SHARE_TEXT, url: APP_URL }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(full);
      alert(t("profile.copied"));
    }
  }

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-center text-sm font-bold wird-muted">
        {t("profile.share")}
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {SHARE_BTNS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => shareVia(b.id)}
            className="wird-card flex flex-col items-center gap-1 p-3 text-xs font-semibold"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
              style={{ background: b.bg }}
            >
              {b.em}
            </span>
            {b.label}
          </button>
        ))}
      </div>

      <h3 className="mb-2 mt-8 text-center text-sm font-bold wird-muted">
        {t("profile.customerService")}
      </h3>
      <div className="wird-card p-4 text-center">
        <a
          href={`https://wa.me/${PHONE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="wird-btn-gold"
        >
          💬 {t("profile.contact")}
        </a>
        <p className="mt-3 font-semibold" dir="ltr">
          {PHONE_DISPLAY}
        </p>
      </div>
    </div>
  );
}
