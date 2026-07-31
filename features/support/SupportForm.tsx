"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n-context";

// Reuses Khalid's Web3Forms key — delivers the message to his email inbox.
const WEB3FORMS_KEY = "6b987b07-9f05-441f-800a-e1d2dcfe15d4";

export default function SupportForm({ userEmail }: { userEmail: string | null }) {
  const t = useT();
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim();
    const email = userEmail || "anonymous@wird.app";
    if (!message) {
      setError(t("support.needMsg"));
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Wird — new message",
          from_name: "Wird app",
          email: email || "no-reply@wird.app",
          message,
        }),
      });
      const data = await res.json();
      if (data.success) setDone(true);
      else setError(data.message || "Failed to send.");
    } catch {
      setError("Network error — try again.");
    }
    setSending(false);
  }

  if (done) {
    return (
      <div className="wird-card p-6 text-center">
        <div className="text-4xl">✅</div>
        <p className="mt-3 font-semibold" style={{ color: "var(--wird-green)" }}>
          {t("support.success")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="wird-card flex flex-col gap-4 p-6 text-start">
      {userEmail ? (
        <p className="text-sm wird-muted">
          {t("support.sendingAs")} <b dir="ltr">{userEmail}</b>
        </p>
      ) : null}
      <label className="flex flex-col gap-1 text-sm font-semibold">
        {t("support.message")}
        <textarea name="message" required rows={4} className="wird-input" />
      </label>
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      ) : null}
      <button type="submit" disabled={sending} className="wird-btn-gold text-center disabled:opacity-60">
        {sending ? t("support.sending") : t("support.send")}
      </button>
    </form>
  );
}
