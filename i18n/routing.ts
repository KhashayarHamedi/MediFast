import { defineRouting } from "next-intl/routing";

/** Top languages by web usage / global reach. Default: German (Austria). Includes Persian (Farsi). */
export const locales = [
  "de", "en", "es", "fr", "it", "pt", "ru", "zh", "ja", "ar",
  "hi", "tr", "pl", "nl", "vi", "ko", "uk", "th", "id", "cs", "fa",
] as const;

export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "de",
  localePrefix: "always",
});

export const rtlLocales: Locale[] = ["ar", "fa"];
