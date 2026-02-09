"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useSeniorMode } from "@/components/senior-mode-provider";
import { Accessibility } from "lucide-react";

/**
 * Toggle for Senior-Modus: extra-large fonts, high-contrast, voice input support.
 */
export function SeniorModeToggle() {
  const t = useTranslations("senior");
  const { enabled, toggle } = useSeniorMode();

  return (
    <Button
      type="button"
      variant={enabled ? "secondary" : "ghost"}
      size="sm"
      onClick={toggle}
      className="min-h-12 min-w-12 gap-2 px-4 py-3 focus-visible:ring-4 focus-visible:ring-[#3b82f6]/50 sm:min-w-[auto]"
      aria-pressed={enabled}
      aria-label={t("mode")}
    >
      <Accessibility className="h-5 w-5 shrink-0 md:h-4 md:w-4" aria-hidden />
      <span className="hidden sm:inline">{t("mode")}</span>
    </Button>
  );
}
