"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locales, type Locale } from "@/i18n/routing";
import { Globe } from "lucide-react";

/** Top 20 languages – native names for the language selector. */
const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  pt: "Português",
  ru: "Русский",
  zh: "中文",
  ja: "日本語",
  ar: "العربية",
  hi: "हिन्दी",
  tr: "Türkçe",
  pl: "Polski",
  nl: "Nederlands",
  vi: "Tiếng Việt",
  ko: "한국어",
  uk: "Українська",
  th: "ไทย",
  id: "Bahasa Indonesia",
  cs: "Čeština",
  fa: "فارسی",
};

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function onLocaleChange(newLocale: string) {
    if (newLocale === locale) return;
    router.replace(pathname || "/", { locale: newLocale as Locale });
  }

  return (
    <Select value={locale} onValueChange={onLocaleChange}>
      {/* BEFORE: small trigger, no min height → overlap on mobile
          AFTER: min-h-12 touch target, responsive width, focus-visible:ring-4 */}
      <SelectTrigger
        className="min-h-12 min-w-[8rem] gap-2 border-border bg-transparent px-4 py-3 text-foreground hover:bg-accent focus-visible:ring-4 focus-visible:ring-primary/50 [&_svg]:text-muted-foreground md:min-w-[10rem]"
        aria-label="Language / Sprache"
      >
        <Globe className="h-5 w-5 shrink-0 md:h-4 md:w-4" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent
        className="max-h-[min(70vh,20rem)] border-border bg-card"
        position="popper"
        align="end"
      >
        {locales.map((loc) => (
          <SelectItem
            key={loc}
            value={loc}
            className="text-foreground focus:bg-accent focus:text-foreground"
          >
            {localeNames[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
