import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Truck, Clock, MapPin } from "lucide-react";
import { Link as NavLink } from "@/lib/navigation";

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Pill className="h-8 w-8 text-primary" aria-hidden />
            <span className="text-xl font-bold tracking-tight">MediFast</span>
          </div>
          <nav className="flex items-center gap-4">
            <NavLink href="/login">
              <Button variant="ghost">{tNav("login")}</Button>
            </NavLink>
            <NavLink href="/signup">
              <Button>{tNav("signup")}</Button>
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">{t("subtitle")}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <NavLink href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                {t("requestMedicine")}
              </Button>
            </NavLink>
            <NavLink href="/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                {t("beCourier")}
              </Button>
            </NavLink>
          </div>
        </section>

        <section className="mt-24 grid gap-8 md:grid-cols-3">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <Clock className="mb-2 h-10 w-10 text-primary" aria-hidden />
              <CardTitle>{t("feature1Title")}</CardTitle>
              <CardDescription>{t("feature1Desc")}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <Truck className="mb-2 h-10 w-10 text-primary" aria-hidden />
              <CardTitle>{t("feature2Title")}</CardTitle>
              <CardDescription>{t("feature2Desc")}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <MapPin className="mb-2 h-10 w-10 text-primary" aria-hidden />
              <CardTitle>{t("feature3Title")}</CardTitle>
              <CardDescription>{t("feature3Desc")}</CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="mt-24">
          <h2 className="text-center text-2xl font-bold">{t("testimonials")}</h2>
          <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">{t("testimonial1")}</p>
                <p className="mt-4 text-sm font-medium">{t("testimonial1Author")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">{t("testimonial2")}</p>
                <p className="mt-4 text-sm font-medium">{t("testimonial2Author")}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-24 rounded-lg border border-border/50 bg-primary/5 p-8 text-center">
          <h2 className="text-2xl font-bold">{t("ctaTitle")}</h2>
          <p className="mt-2 text-muted-foreground">{t("ctaSubtitle")}</p>
          <NavLink href="/signup" className="mt-6 inline-block">
            <Button size="lg">{t("ctaButton")}</Button>
          </NavLink>
        </section>
      </main>

      <footer className="mt-24 border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          {t("footer")}
        </div>
      </footer>
    </div>
  );
}
