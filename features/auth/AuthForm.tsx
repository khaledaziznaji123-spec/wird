"use client";

import { useActionState, useState } from "react";
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
  // On the login page, lead with "Create account"; reveal the login form on demand.
  const [showLoginForm, setShowLoginForm] = useState(false);

  const formBlock = (
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

      {mode === "signup" ? (
        <>
          {formBlock}
          <p className="mt-6 text-center text-sm wird-muted">
            {t("auth.haveAccount")}{" "}
            <Link href="/login" className="font-bold" style={{ color: "var(--wird-green)" }}>
              {t("auth.login")}
            </Link>
          </p>
        </>
      ) : showLoginForm ? (
        <>
          {formBlock}
          <p className="mt-6 text-center text-sm wird-muted">
            {t("auth.noAccount")}{" "}
            <Link href="/signup" className="font-bold" style={{ color: "var(--wird-green)" }}>
              {t("auth.signup")}
            </Link>
          </p>
        </>
      ) : (
        // Login page default: big "Create account" square, small "Log in" under it.
        <div className="flex flex-col items-center gap-4">
          <Link href="/signup" className="wird-btn-gold w-full text-center text-lg">
            {t("auth.signup")}
          </Link>
          <button
            type="button"
            onClick={() => setShowLoginForm(true)}
            className="text-sm wird-muted"
          >
            {t("auth.haveAccount")}{" "}
            <span className="font-bold" style={{ color: "var(--wird-green)" }}>
              {t("auth.login")}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
