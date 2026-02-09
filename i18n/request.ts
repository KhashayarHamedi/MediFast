import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/** Locales that have dedicated message files; others fall back to English. */
const messageLocales = ["ar", "de", "en", "es", "fa", "fr", "it", "ru", "tr", "uk"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }
  const hasMessages = messageLocales.includes(locale as (typeof messageLocales)[number]);
  const messages = hasMessages
    ? (await import(`../messages/${locale}.json`)).default
    : (await import(`../messages/en.json`)).default;
  return {
    locale,
    messages,
  };
});
