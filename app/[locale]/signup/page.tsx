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
import { Pill, User, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

function SignUpForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const roleParam = (searchParams.get("role") as "patient" | "delivery") || "patient";
  const [role, setRole] = useState<"patient" | "delivery">(roleParam);
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f1117] px-4 py-8 text-[#e2e8f0]">
      <Link href="/" className="mb-6 flex items-center gap-2">
        <Pill className="h-7 w-7 text-[#3b82f6]" aria-hidden />
        <span className="text-lg font-bold">MediFast</span>
      </Link>

      <Card className="w-full max-w-md border-white/10 bg-[#161b22]">
        <CardHeader>
          <CardTitle className="text-[#e2e8f0]">{t("signup")}</CardTitle>
          <CardDescription className="text-[#8b949e]">{t("signupDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-colors",
                role === "patient"
                  ? "border-[#3b82f6] bg-[#3b82f6]/20 text-[#3b82f6]"
                  : "border-white/10 text-[#8b949e] hover:bg-white/5"
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
                  ? "border-[#3b82f6] bg-[#3b82f6]/20 text-[#3b82f6]"
                  : "border-white/10 text-[#8b949e] hover:bg-white/5"
              )}
              aria-pressed={role === "delivery"}
            >
              <Truck className="h-5 w-5" />
              <span>{t("delivery")}</span>
            </button>
          </div>

          <form action={onSubmit} className="space-y-4">
            <input type="hidden" name="role" value={role} />
            {error && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400" role="alert">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#e2e8f0]">{t("name")}</Label>
              <Input
                id="name"
                name="name"
                placeholder={t("name")}
                required
                autoComplete="name"
                className="border-white/10 bg-[#0f1117] text-[#e2e8f0]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#e2e8f0]">{t("phone")}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder={t("phone")}
                required
                autoComplete="tel"
                className="border-white/10 bg-[#0f1117] text-[#e2e8f0]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#e2e8f0]">{t("email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                required
                autoComplete="email"
                className="border-white/10 bg-[#0f1117] text-[#e2e8f0]"
              />
            </div>

            {role === "patient" && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="plz" className="text-[#e2e8f0]">{t("plz")}</Label>
                    <Input
                      id="plz"
                      name="plz"
                      placeholder="1010"
                      required
                      className="border-white/10 bg-[#0f1117] text-[#e2e8f0]"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="street" className="text-[#e2e8f0]">{t("street")}</Label>
                    <Input
                      id="street"
                      name="street"
                      placeholder={t("street")}
                      required
                      className="border-white/10 bg-[#0f1117] text-[#e2e8f0]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="houseNumber" className="text-[#e2e8f0]">{t("houseNumber")}</Label>
                  <Input
                    id="houseNumber"
                    name="houseNumber"
                    placeholder="12"
                    required
                    className="border-white/10 bg-[#0f1117] text-[#e2e8f0]"
                  />
                </div>
              </>
            )}

            {role === "delivery" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-[#e2e8f0]">{t("dateOfBirth")}</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    required
                    className="border-white/10 bg-[#0f1117] text-[#e2e8f0]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idDocument" className="text-[#e2e8f0]">{t("idDocument")}</Label>
                  <Input
                    id="idDocument"
                    name="idDocument"
                    type="file"
                    accept="image/*,.pdf"
                    required={role === "delivery"}
                    className="border-white/10 bg-[#0f1117] text-[#e2e8f0]"
                  />
                  <p className="text-xs text-[#8b949e]">{t("idDocumentHint")}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType" className="text-[#e2e8f0]">{t("vehicleType")}</Label>
                  <Input
                    id="vehicleType"
                    name="vehicleType"
                    placeholder={t("vehicleTypePlaceholder")}
                    required
                    className="border-white/10 bg-[#0f1117] text-[#e2e8f0]"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#e2e8f0]">{t("password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t("password")}
                required
                minLength={6}
                autoComplete="new-password"
                className="border-white/10 bg-[#0f1117] text-[#e2e8f0]"
              />
            </div>
            <Button
              type="submit"
              disabled={pending}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white"
            >
              {pending ? "…" : t("signup")}
            </Button>
            <p className="text-center text-sm text-[#8b949e]">
              {t("hasAccount")}{" "}
              <Link href="/login" className="text-[#3b82f6] underline underline-offset-4">
                {t("loginLink")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
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
