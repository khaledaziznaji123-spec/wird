import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

// Arabic-first: this is an Arabic-content worship app. Users can toggle to English.
export const defaultLocale: Locale = "ar";
export const LOCALE_COOKIE = "wird_locale";

const dictionaries = { en, ar } as const;
export type Messages = typeof en;

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "ar" || value === "en";
}
