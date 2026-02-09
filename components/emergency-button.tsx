"use client";

import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const EMERGENCY_TEL = "tel:144";

/**
 * Big emergency button: Notfall / 144 — Austrian emergency + optional family alert.
 * Senior-friendly, always visible when used (e.g. fixed or in hero).
 */
export function EmergencyButton({
  variant = "fixed",
  className,
}: {
  variant?: "fixed" | "inline";
  className?: string;
}) {
  const t = useTranslations("senior");
  const tLanding = useTranslations("landing");

  const button = (
    <Button
      asChild
      variant="destructive"
      size={variant === "fixed" ? "lg" : "default"}
      className={
        variant === "fixed"
          ? `rounded-lg shadow-lg ring-2 ring-destructive/50 ${className ?? ""}`
          : className
      }
      aria-label={t("emergencyAria")}
    >
      <a href={EMERGENCY_TEL}>
        <Phone className="mr-2 h-5 w-5" aria-hidden />
        {t("emergencyButton")}
      </a>
    </Button>
  );

  if (variant === "fixed") {
    return (
      <div className="fixed bottom-6 left-4 right-4 z-40 flex justify-center sm:left-auto sm:right-6 sm:max-w-[200px]">
        {button}
      </div>
    );
  }

  return button;
}
