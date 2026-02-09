"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const CONSENT_STORAGE_KEY = "medifast_consent_v1";

/**
 * Age 18+ and GDPR/health data consent on first load.
 * Must accept to use the site; decline shows message (no close without accepting).
 */
export function ConsentModal() {
  const t = useTranslations("consent");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"age" | "gdpr">("age");
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === "accepted") return;
    setOpen(true);
  }, []);

  const handleAccept = () => {
    if (step === "age") {
      setStep("gdpr");
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
    }
    setOpen(false);
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  if (!open) return null;

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {step === "age" ? t("ageTitle") : t("gdprTitle")}
          </DialogTitle>
          <DialogDescription>
            {step === "age" ? t("ageMessage") : t("gdprMessage")}
          </DialogDescription>
        </DialogHeader>
        {declined && (
          <p className="text-sm text-destructive" role="alert">
            {t("declineMessage")}
          </p>
        )}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleDecline}>
            {t("decline")}
          </Button>
          <Button onClick={handleAccept}>{t("accept")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
