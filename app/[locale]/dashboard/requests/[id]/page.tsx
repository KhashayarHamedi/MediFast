import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requests } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Package, MapPin, CheckCircle2, Circle } from "lucide-react";
import { TrackingPoll } from "./tracking-poll";
import { getTranslations } from "next-intl/server";

const statusKeys = ["pending", "accepted", "picked_up", "delivering", "delivered"] as const;

export default async function RequestTrackingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);
  if (user.role !== "patient") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("requests");

  const [req] = await db
    .select()
    .from(requests)
    .where(and(eq(requests.id, id), eq(requests.patientId, user.id)));

  if (!req) notFound();

  const currentIdx = statusKeys.indexOf(req.status as (typeof statusKeys)[number]);
  const safeIdx = currentIdx >= 0 ? currentIdx : 0;
  const isActive = !["delivered", "cancelled"].includes(req.status);

  const statusLabel = req.status === "delivered" ? t("delivered") : req.status === "cancelled" ? t("cancelled") : t("inProgress");

  return (
    <div className="space-y-6">
      <TrackingPoll requestId={id} isActive={isActive} />
      <Link href="/dashboard/requests" className="text-base text-muted-foreground hover:text-foreground">
        ← {t("backToRequests")}
      </Link>
      {/* Status first - principle 3 */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">{t("status")}</CardTitle>
          <CardDescription className="text-base">
            {isActive ? t("statusDesc") : t("statusDone")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {statusKeys.map((key, i) => {
              const done = i <= safeIdx;
              const current = i === safeIdx;
              const label = t(key);
              return (
                <div key={key} className="flex gap-4 pb-5 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                        done ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </div>
                    {i < statusKeys.length - 1 && (
                      <div
                        className={`mt-1 w-0.5 flex-1 min-h-[28px] ${done ? "bg-primary" : "bg-muted"}`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <p className={`text-base font-medium ${current ? "text-primary" : ""}`}>{label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5" />
            {req.medicines}
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {req.address}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant={isActive ? "secondary" : "default"} className="text-sm">
            {statusLabel}
          </Badge>
          <p className="mt-2 text-sm text-muted-foreground">
            {req.paymentMethod === "cash" ? t("paymentNote") : "Online"}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/dashboard/requests">
          <Button variant="outline" size="lg">{t("backToList")}</Button>
        </Link>
      </div>
    </div>
  );
}
