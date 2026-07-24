import { cookies } from "next/headers";
import {
  getMessages,
  isLocale,
  defaultLocale,
  LOCALE_COOKIE,
  type Locale,
} from "./i18n";

/** The active locale, read from the cookie (server-side). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const c = store.get(LOCALE_COOKIE)?.value;
  return isLocale(c) ? c : defaultLocale;
}

/** A translate function + locale for use in Server Components. */
export async function getServerT() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const t = (path: string): string => {
    const v = path
      .split(".")
      .reduce<unknown>(
        (o, k) =>
          o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined,
        messages,
      );
    return typeof v === "string" ? v : path;
  };
  return { t, locale };
}
