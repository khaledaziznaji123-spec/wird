"use client";

import { createContext, useContext, useCallback } from "react";
import type { Locale, Messages } from "./i18n";

type I18nValue = { locale: Locale; messages: Messages };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: I18nValue & { children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ locale, messages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

/**
 * Returns a translate function `t("home.welcome")` that reads a dotted key
 * path from the active message catalog. Falls back to the key if missing.
 */
export function useT() {
  const { messages } = useI18n();
  return useCallback(
    (path: string): string => {
      const value = path
        .split(".")
        .reduce<unknown>(
          (obj, key) =>
            obj && typeof obj === "object"
              ? (obj as Record<string, unknown>)[key]
              : undefined,
          messages,
        );
      return typeof value === "string" ? value : path;
    },
    [messages],
  );
}
