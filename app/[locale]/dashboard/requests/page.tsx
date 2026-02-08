import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requests, users } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import Link from "next/link";

const statusLabel: Record<string, string> = {
  pending: "در انتظار پیک",
  accepted: "پذیرفته شده",
  picked_up: "دریافت از داروخانه",
  delivering: "در حال ارسال",
  delivered: "تحویل داده شد",
  cancelled: "لغو شده",
};

export default async function PatientRequestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);
  if (user.role !== "patient") redirect(`/${locale}/dashboard`);

  const myRequests = await db
    .select({
      id: requests.id,
      medicines: requests.medicines,
      address: requests.address,
      status: requests.status,
      createdAt: requests.createdAt,
    })
    .from(requests)
    .where(eq(requests.patientId, user.id))
    .orderBy(desc(requests.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">درخواست‌های من</h1>
        <p className="text-muted-foreground">وضعیت سفارشات دارویی شما</p>
      </div>

      <div className="flex gap-4">
        <Link href="/dashboard/request">
          <Package className="inline h-5 w-5 ml-1" />
          درخواست جدید
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>سابقه درخواست‌ها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {myRequests.length === 0 ? (
            <p className="text-muted-foreground">هنوز درخواستی ثبت نکرده‌اید</p>
          ) : (
            myRequests.map((r) => (
              <Link key={r.id} href={`/dashboard/requests/${r.id}`}>
                <div
                  className="flex flex-col gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{r.medicines}</p>
                    <p className="text-sm text-muted-foreground">{r.address}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <Badge variant={r.status === "delivered" ? "default" : "secondary"}>
                    {statusLabel[r.status] || r.status}
                  </Badge>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
