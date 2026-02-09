import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Truck, Clock, Shield, Banknote, Lock, CheckCircle2 } from "lucide-react";
import { Link as NavLink } from "@/lib/navigation";
import { db } from "@/lib/db";
import { pharmacies, type Pharmacy } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { MapClient } from "./dashboard/map/map-client";
import { LegalDisclaimer, PartnerDisclaimer } from "@/components/legal-disclaimer";
import { EmergencyButton } from "@/components/emergency-button";
import { FloatingHealthIcons } from "@/components/floating-health-icons";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { setRequestLocale } = await import("next-intl/server");
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  const tNav = await getTranslations("nav");

  let pharmaciesList: Pharmacy[] = [];
  try {
    pharmaciesList = await db
      .select()
      .from(pharmacies)
      .where(eq(pharmacies.city, "vienna"));
  } catch {
    // DB not set up or table/column missing — show page with empty map so you can see the UI
  }
  const openCount = pharmaciesList.filter((p) => p.is24h).length;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <FloatingHealthIcons />
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-3 md:gap-6 md:px-6 md:py-3">
          <div className="flex items-center gap-2 shrink-0">
            <Pill className="h-7 w-7 text-primary" aria-hidden />
            <span className="text-lg font-bold tracking-tight text-foreground md:text-xl">MediFast</span>
          </div>
          <nav className="flex flex-wrap items-center gap-3 md:gap-4" aria-label="Main">
            <NavLink href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="min-h-12 min-w-[120px] px-5 py-3 text-base md:min-w-auto md:text-sm"
              >
                {tNav("login")}
              </Button>
            </NavLink>
            <NavLink href="/signup">
              <Button
                size="sm"
                className="min-h-12 min-w-[120px] px-5 py-3 text-base text-primary-foreground md:min-w-auto md:text-sm"
              >
                {tNav("signup")}
              </Button>
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 pb-24">
        {/* Legal disclaimer – Austria BASG/AMG §59 compliance */}
        <section className="mb-6">
          <LegalDisclaimer variant="banner" />
        </section>

        {/* Availability badge – secondary (sage green) */}
        <section className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-sm font-medium text-secondary-foreground dark:text-secondary">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            {openCount > 0
              ? `${openCount} ${t("availabilityBadge").toLowerCase()}`
              : t("availabilityBadge")}
          </span>
        </section>

        {/* Hero: OTC vs Rx – primary CTAs, muted subtext */}
        <section className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("hero")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subheadline")}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-secondary">
              <Lock className="h-4 w-4" aria-hidden />
              {t("sicherDiskret")}
            </span>
            <span className="inline-flex items-center gap-1.5 text-secondary">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              {t("apothekerGeprueft")}
            </span>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <NavLink href="/signup?flow=otc">
              <Button size="lg" className="h-14 min-w-[200px] rounded-lg text-lg font-semibold">
                {t("requestOtc")}
              </Button>
            </NavLink>
            <NavLink href="/signup?flow=rx">
              <Button
                size="lg"
                variant="outline"
                className="h-14 min-w-[200px] rounded-lg border-primary/50 text-primary hover:bg-primary/10"
              >
                {t("requestRx")}
              </Button>
            </NavLink>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t("microReassurance")}</p>
        </section>

        {/* Reassurance blocks (4) – card bg, primary icons, foreground text */}
        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 pt-4">
              <Clock className="h-8 w-8 shrink-0 text-primary" />
              <p className="font-medium text-foreground">{t("reassurance1")}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 pt-4">
              <Truck className="h-8 w-8 shrink-0 text-primary" />
              <p className="font-medium text-foreground">{t("reassurance2")}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 pt-4">
              <Shield className="h-8 w-8 shrink-0 text-primary" />
              <p className="font-medium text-foreground">{t("reassurance3")}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 pt-4">
              <Banknote className="h-8 w-8 shrink-0 text-primary" />
              <p className="font-medium text-foreground">{t("reassurance4")}</p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12">
          <h2 className="mb-3 text-xl font-semibold text-foreground">{t("mapTitle")}</h2>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="h-[400px] min-h-[320px] w-full">
              <MapClient pharmacies={pharmaciesList} />
            </div>
          </div>
        </section>

        {/* Testimonials – card bg, muted quote, foreground author */}
        <section className="mt-12">
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="pt-4">
                <p className="text-muted-foreground">&ldquo;{t("testimonial1")}&rdquo;</p>
                <p className="mt-2 text-sm font-medium text-foreground">{t("testimonial1Author")}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-4">
                <p className="text-muted-foreground">&ldquo;{t("testimonial2")}&rdquo;</p>
                <p className="mt-2 text-sm font-medium text-foreground">{t("testimonial2Author")}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-4">
                <p className="text-muted-foreground">&ldquo;{t("testimonialSenior")}&rdquo;</p>
                <p className="mt-2 text-sm font-medium text-foreground">{t("testimonialSeniorAuthor")}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <p className="mt-8 text-center text-sm text-muted-foreground">{t("emergency")}</p>
        <div className="mt-4 flex justify-center">
          <EmergencyButton variant="inline" />
        </div>

        <section className="mt-8 text-center">
          <NavLink href="/signup">
            <Button variant="outline" className="rounded-lg border-primary/50 text-primary hover:bg-primary/10">
              {t("ctaButton")}
            </Button>
          </NavLink>
        </section>
      </main>

      <footer className="mt-12 border-t border-border py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row flex-wrap">
          <p className="text-sm text-muted-foreground">{t("footer")}</p>
          <PartnerDisclaimer />
          <NavLink
            href="/signup?role=delivery"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            {t("beCourier")}
          </NavLink>
        </div>
      </footer>
    </div>
  );
}
