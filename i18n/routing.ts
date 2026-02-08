import { defineRouting } from "next-intl/routing";

export const locales = [
  "de",
  "en",
  "es",
  "fr",
  "it",
  "ru",
  "uk",
  "ar",
  "tr",
  "fa",
] as const;

export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "de",
  localePrefix: "always",
});

export const rtlLocales: Locale[] = ["ar", "fa"];
