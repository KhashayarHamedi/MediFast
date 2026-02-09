import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Vazirmatn } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { routing } from "@/i18n/routing";
import { rtlLocales } from "@/i18n/routing";
import { LanguageSelector } from "@/components/language-selector";
import { ClientProviders } from "@/components/client-providers";
import { SeniorModeToggle } from "@/components/senior-mode-toggle";
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
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider messages={messages}>
        <ClientProviders>
        {/* BEFORE: single row, no wrap → overlap on small screens
            AFTER: full-width on mobile, flex-wrap + gap, safe-area, content clears bar */}
        <div
          data-slot="top-bar"
          className="top-bar fixed top-0 right-0 left-0 z-50 flex flex-wrap items-center justify-end gap-4 border-b border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur-sm md:left-auto md:right-4 md:top-4 md:w-auto md:gap-6 md:rounded-xl md:border md:px-4 md:py-2"
          style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
        >
          <LanguageSelector />
          <div className="hidden h-6 w-px shrink-0 bg-muted-foreground/30 md:block" aria-hidden />
          <SeniorModeToggle />
        </div>
        <div
          className={`${isRtl ? vazirmatn.variable : inter.variable} font-sans min-h-screen`}
          style={{ fontFamily: isRtl ? "var(--font-vazirmatn)" : "var(--font-inter)" } as React.CSSProperties}
        >
          {/* Spacer so content is not under fixed bar; larger on mobile when bar can wrap */}
          <div className="h-[4.5rem] md:h-14" aria-hidden />
          {children}
        </div>
        <Toaster richColors position="top-center" />
        </ClientProviders>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
