"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, signup, type AuthState } from "./actions";
import { useT } from "@/lib/i18n-context";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const t = useT();
  const action = mode === "login" ? login : signup;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    {},
  );

  return (
    <div className="mx-auto w-full max-w-sm px-6 py-12">
      <div className="mb-6 text-center text-4xl" aria-hidden>
        🕌
      </div>
      <h1
        className="mb-6 text-center text-3xl font-extrabold"
        style={{ color: "var(--wird-green)" }}
      >
        {t(mode === "login" ? "auth.loginTitle" : "auth.signupTitle")}
      </h1>

      <form action={formAction} className="wird-card flex flex-col gap-4 p-6">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          {t("auth.email")}
          <input name="email" type="email" required autoComplete="email" className="wird-input" />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          {t("auth.password")}
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="wird-input"
          />
        </label>

        {state.error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="wird-btn-gold mt-2 text-center disabled:opacity-60"
        >
          {pending
            ? t("auth.loading")
            : t(mode === "login" ? "auth.login" : "auth.signup")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm wird-muted">
        {t(mode === "login" ? "auth.noAccount" : "auth.haveAccount")}{" "}
        <Link
          href={mode === "login" ? "/signup" : "/login"}
          className="font-bold"
          style={{ color: "var(--wird-green)" }}
        >
          {t(mode === "login" ? "auth.signup" : "auth.login")}
        </Link>
      </p>
    </div>
  );
}
