import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { pharmacies } from "@/drizzle/schema";
import { MapClient } from "./map-client";

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);

  const pharmaciesList = await db.select().from(pharmacies);

  return (
    <div className="h-[calc(100vh-8rem)] min-h-[400px] rounded-lg border border-border overflow-hidden">
      <MapClient pharmacies={pharmaciesList} />
    </div>
  );
}
