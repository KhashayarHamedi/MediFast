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

const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  ru: "Русский",
  uk: "Українська",
  ar: "العربية",
  tr: "Türkçe",
  fa: "فارسی",
};

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function onLocaleChange(newLocale: string) {
    router.replace(pathname || "/", { locale: newLocale });
  }

  return (
    <Select value={locale} onValueChange={onLocaleChange}>
      <SelectTrigger className="w-[140px] gap-2" aria-label="Sprache wählen">
        <Globe className="h-4 w-4 shrink-0" />
        <SelectValue placeholder="Sprache" />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeNames[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
