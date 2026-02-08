import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requests } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { Link } from "@/lib/navigation";
import { getTranslations } from "next-intl/server";

export default async function PatientRequestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);
  if (user.role !== "patient") redirect(`/${locale}/dashboard`);

  const t = await getTranslations("requests");

  const statusKeys: Record<string, string> = {
    pending: t("pending"),
    accepted: t("accepted"),
    picked_up: t("picked_up"),
    delivering: t("delivering"),
    delivered: t("delivered"),
    cancelled: t("cancelled"),
  };

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
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-base text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Link href="/dashboard/request">
        <Button size="lg" className="h-12 min-w-[200px] text-base">
          <Package className="mr-2 h-5 w-5" />
          {t("newRequest")}
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t("history")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {myRequests.length === 0 ? (
            <p className="text-base text-muted-foreground">{t("noRequests")}</p>
          ) : (
            myRequests.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <Link href={`/dashboard/requests/${r.id}`} className="flex-1">
                  <p className="text-base font-medium">{r.medicines}</p>
                  <p className="text-sm text-muted-foreground">{r.address}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </Link>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <Badge variant={r.status === "delivered" ? "default" : "secondary"} className="text-sm">
                    {statusKeys[r.status] || r.status}
                  </Badge>
                  {r.status === "delivered" && (
                    <Link href={`/dashboard/request?repeat=${encodeURIComponent(r.medicines)}`}>
                      <Button variant="outline" size="sm">{t("orderAgain")}</Button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
