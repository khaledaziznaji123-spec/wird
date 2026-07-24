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
      <h1
        className="mb-6 text-center text-3xl font-extrabold"
        style={{ color: "var(--wird-gold)" }}
      >
        {t(mode === "login" ? "auth.loginTitle" : "auth.signupTitle")}
      </h1>

      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          {t("auth.email")}
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-white/40"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          {t("auth.password")}
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-white/40"
          />
        </label>

        {state.error ? (
          <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-lg py-2.5 font-bold text-black transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "var(--wird-gold)" }}
        >
          {pending
            ? t("auth.loading")
            : t(mode === "login" ? "auth.login" : "auth.signup")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm opacity-80">
        {t(mode === "login" ? "auth.noAccount" : "auth.haveAccount")}{" "}
        <Link
          href={mode === "login" ? "/signup" : "/login"}
          className="font-semibold underline"
          style={{ color: "var(--wird-gold)" }}
        >
          {t(mode === "login" ? "auth.signup" : "auth.login")}
        </Link>
      </p>
    </div>
  );
}
