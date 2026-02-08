import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requests } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, MapPin, CheckCircle2, Circle } from "lucide-react";
import { TrackingPoll } from "./tracking-poll";

const statusSteps = [
  { key: "pending", label: "در انتظار پیک" },
  { key: "accepted", label: "پذیرفته شده" },
  { key: "picked_up", label: "از داروخانه دریافت شد" },
  { key: "delivering", label: "در حال ارسال" },
  { key: "delivered", label: "تحویل داده شد" },
] as const;

export default async function RequestTrackingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);
  if (user.role !== "patient") redirect(`/${locale}/dashboard`);

  const [req] = await db
    .select()
    .from(requests)
    .where(and(eq(requests.id, id), eq(requests.patientId, user.id)));

  if (!req) notFound();

  const currentIdx = statusSteps.findIndex((s) => s.key === req.status);
  const isActive = !["delivered", "cancelled"].includes(req.status);

  return (
    <div className="space-y-6">
      <TrackingPoll requestId={id} isActive={isActive} />
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/requests"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← بازگشت به درخواست‌ها
          </Link>
          <h1 className="mt-2 text-2xl font-bold">ردیابی سفارش</h1>
        </div>
        <Badge variant={isActive ? "secondary" : "default"}>
          {req.status === "delivered" ? "تحویل شده" : req.status === "cancelled" ? "لغو شده" : "در حال انجام"}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {req.medicines}
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {req.address}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            ثبت شده: {new Date(req.createdAt).toLocaleString("fa-IR")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>وضعیت</CardTitle>
          <CardDescription>
            {isActive
              ? "پیک در حال انجام سفارش شماست. وضعیت به‌روزرسانی می‌شود."
              : "سفارش تکمیل شد."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {statusSteps.map((step, i) => {
              const done = i <= currentIdx;
              const current = i === currentIdx;
              return (
                <div key={step.key} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        done ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div
                        className={`mt-1 w-0.5 flex-1 min-h-[24px] ${
                          done ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`font-medium ${current ? "text-primary" : ""}`}>{step.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {isActive && (
        <p className="text-center text-sm text-muted-foreground">
          پرداخت نقدی در محل — {req.paymentMethod === "cash" ? "نقد" : "آنلاین"}
        </p>
      )}

      <div className="flex justify-center">
        <Link href="/dashboard/requests">
          <Button variant="outline">بازگشت به لیست</Button>
        </Link>
      </div>
    </div>
  );
}
