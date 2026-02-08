import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Truck, Clock, MapPin, Shield, Banknote } from "lucide-react";
import { Link as NavLink } from "@/lib/navigation";
import { db } from "@/lib/db";
import { pharmacies } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { MapClient } from "./dashboard/map/map-client";

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

  const pharmaciesList = await db
    .select()
    .from(pharmacies)
    .where(eq(pharmacies.city, "vienna"));
  const openCount = pharmaciesList.filter((p) => p.is24h).length;

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e2e8f0]">
      <header className="border-b border-white/10 bg-[#161b22]/80 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Pill className="h-7 w-7 text-[#3b82f6]" aria-hidden />
            <span className="text-lg font-bold tracking-tight">MediFast</span>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink href="/login">
              <Button variant="ghost" size="sm" className="text-[#e2e8f0] hover:bg-white/10">
                {tNav("login")}
              </Button>
            </NavLink>
            <NavLink href="/signup">
              <Button size="sm" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                {tNav("signup")}
              </Button>
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Availability badge above fold */}
        <section className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {openCount > 0
              ? `${openCount} ${t("availabilityBadge").toLowerCase()}`
              : t("availabilityBadge")}
          </span>
        </section>

        {/* Hero: max 8 words + subheadline */}
        <section className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#e2e8f0] sm:text-4xl md:text-5xl">
            {t("hero")}
          </h1>
          <p className="mt-4 text-lg text-[#8b949e]">{t("subheadline")}</p>
          <div className="mt-8">
            <NavLink href="/signup">
              <Button
                size="lg"
                className="h-14 min-w-[220px] bg-[#3b82f6] text-lg font-semibold hover:bg-[#2563eb] text-white"
              >
                {t("requestMedicineNow")}
              </Button>
            </NavLink>
            <p className="mt-3 text-sm text-[#8b949e]">{t("microReassurance")}</p>
          </div>
        </section>

        {/* Reassurance blocks (4) */}
        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-white/10 bg-[#161b22]">
            <CardContent className="flex items-center gap-3 pt-4">
              <Clock className="h-8 w-8 shrink-0 text-[#3b82f6]" />
              <div>
                <p className="font-medium text-[#e2e8f0]">{t("reassurance1")}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-[#161b22]">
            <CardContent className="flex items-center gap-3 pt-4">
              <Truck className="h-8 w-8 shrink-0 text-[#3b82f6]" />
              <div>
                <p className="font-medium text-[#e2e8f0]">{t("reassurance2")}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-[#161b22]">
            <CardContent className="flex items-center gap-3 pt-4">
              <Shield className="h-8 w-8 shrink-0 text-[#3b82f6]" />
              <div>
                <p className="font-medium text-[#e2e8f0]">{t("reassurance3")}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-[#161b22]">
            <CardContent className="flex items-center gap-3 pt-4">
              <Banknote className="h-8 w-8 shrink-0 text-[#3b82f6]" />
              <div>
                <p className="font-medium text-[#e2e8f0]">{t("reassurance4")}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Map section – prominent below hero */}
        <section className="mt-12">
          <h2 className="mb-3 text-xl font-semibold text-[#e2e8f0]">{t("mapTitle")}</h2>
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[#161b22]">
            <div className="h-[400px] min-h-[320px] w-full">
              <MapClient pharmacies={pharmaciesList} />
            </div>
          </div>
        </section>

        {/* Testimonials (1–2 short) */}
        <section className="mt-12">
          <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
            <Card className="border-white/10 bg-[#161b22]">
              <CardContent className="pt-4">
                <p className="text-[#8b949e]">&ldquo;{t("testimonial1")}&rdquo;</p>
                <p className="mt-2 text-sm font-medium text-[#e2e8f0]">{t("testimonial1Author")}</p>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-[#161b22]">
              <CardContent className="pt-4">
                <p className="text-[#8b949e]">&ldquo;{t("testimonial2")}&rdquo;</p>
                <p className="mt-2 text-sm font-medium text-[#e2e8f0]">{t("testimonial2Author")}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Emergency micro-copy */}
        <p className="mt-8 text-center text-sm text-[#8b949e]">
          {t("emergency")}
        </p>

        {/* Final CTA */}
        <section className="mt-8 text-center">
          <NavLink href="/signup">
            <Button
              variant="outline"
              className="border-[#3b82f6]/50 text-[#3b82f6] hover:bg-[#3b82f6]/10"
            >
              {t("ctaButton")}
            </Button>
          </NavLink>
        </section>
      </main>

      <footer className="mt-12 border-t border-white/10 py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <p className="text-sm text-[#8b949e]">{t("footer")}</p>
          <NavLink
            href="/signup?role=delivery"
            className="text-sm text-[#8b949e] underline underline-offset-4 hover:text-[#e2e8f0]"
          >
            {t("beCourier")}
          </NavLink>
        </div>
      </footer>
    </div>
  );
}
