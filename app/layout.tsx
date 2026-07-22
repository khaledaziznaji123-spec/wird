import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import {
  defaultLocale,
  getMessages,
  dir,
  isLocale,
  LOCALE_COOKIE,
} from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n-context";
import Header from "@/components/Header";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

// Cairo supports both Arabic and Latin — ideal for a bilingual UI.
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Wird — Daily Worship Companion",
  description: "Adhkar with proof, the Quran, and authentic hadith — your daily wird.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Wird", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#0e5c3a",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies();
  const cookieLocale = store.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const messages = getMessages(locale);

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <I18nProvider locale={locale} messages={messages}>
          <Header />
          <main className="w-full flex-1">{children}</main>
        </I18nProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
