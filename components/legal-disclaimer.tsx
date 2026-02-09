"use client";

import { useTranslations } from "next-intl";
import { ExternalLink, ShieldCheck } from "lucide-react";

const BASG_URL = "https://versandapotheken.basg.gv.at/";

/**
 * Legal compliance: Austria BASG/AMG §59 — Rx cannot be shipped.
 * Shown on hero, sign-up, checkout. BASG link + EU safety logo placeholder.
 */
export function LegalDisclaimer({ variant = "inline" }: { variant?: "inline" | "banner" }) {
  const t = useTranslations("legal");

  if (variant === "banner") {
    return (
      <div
        role="region"
        aria-label={t("disclaimer")}
        className="rounded-lg border border-muted bg-accent-warm/15 px-4 py-3 text-sm text-foreground dark:bg-accent-warm/10"
      >
        <p className="font-medium">{t("disclaimer")}</p>
        <a
          href={BASG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-primary underline underline-offset-2 hover:opacity-90"
        >
          {t("basgLink")}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label={t("disclaimer")}
      className="flex flex-wrap items-start gap-3 text-sm text-muted-foreground"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-secondary/40 bg-secondary/20 text-secondary"
        title="Österreich / EU-geprüft"
        aria-hidden
      >
        <ShieldCheck className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p>{t("disclaimer")}</p>
        <a
          href={BASG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1 text-primary underline underline-offset-2"
        >
          {t("basgLink")}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}

/** Partner disclaimer for sign-up and trust areas. */
export function PartnerDisclaimer() {
  const t = useTranslations("legal");
  return (
    <p className="text-center text-sm text-muted-foreground" role="doc-tip">
      {t("partnerDisclaimer")}
    </p>
  );
}
