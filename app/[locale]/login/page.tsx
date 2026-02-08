"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "@/actions/auth";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { Pill } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    const result = await signIn({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    if (result && "error" in result && result.error && "_form" in result.error) {
      setError(result.error._form[0]);
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
          <CardTitle>{t("login")}</CardTitle>
          <CardDescription>
            {registered ? t("registered") : t("loginDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                {error}
              </div>
            )}
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
                required
                autoComplete="current-password"
                aria-label={t("password")}
              />
            </div>
            <Button type="submit" className="w-full">
              {t("login")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("noAccount")}{" "}
              <Link href="/signup" className="text-primary underline underline-offset-4">
                {t("signupLink")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
