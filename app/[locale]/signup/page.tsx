"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signUp } from "@/actions/auth";
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

  async function onSubmit(formData: FormData) {
    setError(null);
    const result = await signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      role,
    });
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
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Pill className="h-8 w-8 text-primary" aria-hidden />
        <span className="text-xl font-bold">MediFast</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("signup")}</CardTitle>
          <CardDescription>{t("signupDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-colors",
                role === "patient"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted/50"
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
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted/50"
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
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                name="name"
                placeholder={t("name")}
                required
                autoComplete="name"
                aria-label={t("name")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder={t("phone")}
                required
                autoComplete="tel"
                aria-label={t("phone")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                required
                autoComplete="email"
                aria-label={t("email")}
              />
            </div>
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
                aria-label={t("password")}
              />
            </div>
            <Button type="submit" className="w-full">
              {t("signup")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("hasAccount")}{" "}
              <Link href="/login" className="text-primary underline underline-offset-4">
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
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
