import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { Package, Map, User, Truck } from "lucide-react";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);

  const t = await getTranslations("dashboard");
  const isPatient = user.role === "patient";
  const isDelivery = user.role === "delivery";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          {t("welcome", { name: user.name })}
        </h1>
        <p className="text-base text-muted-foreground">
          {isPatient ? t("patientDesc") : t("deliveryDesc")}
        </p>
      </div>

      {/* One primary action first - principle 2 */}
      {isPatient && (
        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <Package className="mb-2 h-12 w-12 text-primary" aria-hidden />
              <CardTitle className="text-xl">{t("requestMedicine")}</CardTitle>
              <CardDescription className="text-base">{t("requestMedicineDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/request">
                <Button size="lg" className="h-12 min-w-[200px] text-base w-full">{t("createRequest")}</Button>
              </Link>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Package className="mb-2 h-10 w-10 text-primary" aria-hidden />
                <CardTitle>{t("myRequests")}</CardTitle>
                <CardDescription>{t("myRequestsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/requests">
                  <Button variant="outline" className="w-full">{t("viewRequests")}</Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Map className="mb-2 h-10 w-10 text-primary" aria-hidden />
                <CardTitle>{t("mapTitle")}</CardTitle>
                <CardDescription>{t("mapDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/map">
                  <Button variant="outline" className="w-full">{t("viewMap")}</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {isDelivery && (
        <Card>
          <CardHeader>
            <Truck className="mb-2 h-10 w-10 text-primary" aria-hidden />
            <CardTitle>{t("jobsTitle")}</CardTitle>
            <CardDescription>{t("jobsDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/jobs">
              <Button className="w-full">{t("viewJobs")}</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <User className="mb-2 h-10 w-10 text-primary" aria-hidden />
          <CardTitle>{t("profileTitle")}</CardTitle>
          <CardDescription>{t("profileDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/profile">
            <Button variant="outline" className="w-full">{t("editProfile")}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
