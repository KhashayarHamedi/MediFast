"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signUpFromForm } from "@/actions/auth";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { Pill, User, Truck, Package, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { LegalDisclaimer, PartnerDisclaimer } from "@/components/legal-disclaimer";

function SignUpForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const roleParam = (searchParams.get("role") as "patient" | "delivery") || "patient";
  const flowParam = (searchParams.get("flow") as "otc" | "rx") || null;
  const [role, setRole] = useState<"patient" | "delivery">(roleParam);
  const [patientFlow, setPatientFlow] = useState<"otc" | "rx">(flowParam ?? "otc");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    formData.set("role", role);
    if (role === "delivery") {
      const fileInput = document.getElementById("idDocument") as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.set("idDocument", fileInput.files[0]);
      }
    }
    const result = await signUpFromForm(formData);
    setPending(false);
    if (result && "error" in result && result.error) {
      const err = result.error as Record<string, string[]>;
      if ("_form" in err && err._form) setError(err._form[0]);
      else {
        const first = Object.values(err).flat()[0];
        if (typeof first === "string") setError(first);
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 text-foreground">
      <Link href="/" className="mb-6 flex items-center gap-2">
        <Pill className="h-7 w-7 text-primary" aria-hidden />
        <span className="text-lg font-bold">MediFast</span>
      </Link>

      <div className="mb-6 w-full max-w-md">
        <LegalDisclaimer variant="banner" />
      </div>

      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">{t("signup")}</CardTitle>
          <CardDescription className="text-muted-foreground">{t("signupDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-colors",
                role === "patient"
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              )}
              aria-pressed={role === "patient"}
            >
              <User className="h-5 w-5" />
              <span>{t("patient")}</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("delivery")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-colors",
                role === "delivery"
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              )}
              aria-pressed={role === "delivery"}
            >
              <Truck className="h-5 w-5" />
              <span>{t("delivery")}</span>
            </button>
          </div>
          {role === "patient" && (
            <div className="mb-6 flex gap-2">
              <button
                type="button"
                onClick={() => setPatientFlow("otc")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-md border p-3 text-left transition-colors",
                  patientFlow === "otc"
                    ? "border-secondary bg-secondary/20 text-secondary-foreground dark:text-secondary"
                    : "border-border text-muted-foreground hover:bg-accent"
                )}
                aria-pressed={patientFlow === "otc"}
              >
                <Package className="h-5 w-5 shrink-0" />
                <span className="text-sm">{t("signupOtc")}</span>
              </button>
              <button
                type="button"
                onClick={() => setPatientFlow("rx")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-md border p-3 text-left transition-colors",
                  patientFlow === "rx"
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent"
                )}
                aria-pressed={patientFlow === "rx"}
              >
                <FileCheck className="h-5 w-5 shrink-0" />
                <span className="text-sm">{t("signupRx")}</span>
              </button>
            </div>
          )}
          {role === "patient" && (
            <p className="mb-4 text-sm text-[#8b949e]">
              {patientFlow === "otc" ? t("signupFlowOtcDesc") : t("signupFlowRxDesc")}
            </p>
          )}

          <form action={onSubmit} className="space-y-4">
            <input type="hidden" name="role" value={role} />
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" name="name" placeholder={t("name")} required autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input id="phone" name="phone" type="tel" placeholder={t("phone")} required autoComplete="tel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" name="email" type="email" placeholder="example@email.com" required autoComplete="email" />
            </div>

            {role === "patient" && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="plz">{t("plz")}</Label>
                    <Input id="plz" name="plz" placeholder="1010" required />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="street">{t("street")}</Label>
                    <Input id="street" name="street" placeholder={t("street")} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="houseNumber">{t("houseNumber")}</Label>
                  <Input id="houseNumber" name="houseNumber" placeholder="12" required />
                </div>
              </>
            )}

            {role === "delivery" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">{t("dateOfBirth")}</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idDocument">{t("idDocument")}</Label>
                  <Input id="idDocument" name="idDocument" type="file" accept="image/*,.pdf" required={role === "delivery"} />
                  <p className="text-xs text-muted-foreground">{t("idDocumentHint")}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">{t("vehicleType")}</Label>
                  <Input id="vehicleType" name="vehicleType" placeholder={t("vehicleTypePlaceholder")} required />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t("password")}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <Button
              type="submit"
              disabled={pending}
              className="w-full"
            >
              {pending ? "…" : t("signup")}
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t("hasAccount")}{" "}
              <Link href="/login" className="text-primary underline underline-offset-4">
                {t("loginLink")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
      <div className="mt-4 w-full max-w-md text-center">
        <PartnerDisclaimer />
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0f1117] text-[#8b949e]">
          Loading…
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
