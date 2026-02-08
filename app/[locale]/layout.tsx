import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Vazirmatn } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { routing } from "@/i18n/routing";
import { rtlLocales } from "@/i18n/routing";
import { LanguageSelector } from "@/components/language-selector";
import type { Locale } from "@/i18n/routing";
import "../globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const isRtl = rtlLocales.includes(locale as Locale);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider messages={messages}>
        <div className="fixed top-4 right-4 z-50">
          <LanguageSelector />
        </div>
        <div
          className={`${isRtl ? vazirmatn.variable : inter.variable} font-sans min-h-screen`}
          style={{ fontFamily: isRtl ? "var(--font-vazirmatn)" : "var(--font-inter)" } as React.CSSProperties}
        >
          {children}
        </div>
        <Toaster richColors position="top-center" />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
