import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requests, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { JobsList } from "./jobs-list";
import { OnlineToggle } from "./online-toggle";

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);
  if (user.role !== "delivery") redirect(`/${locale}/dashboard`);

  const pending = await db
    .select({
      id: requests.id,
      medicines: requests.medicines,
      address: requests.address,
      status: requests.status,
      createdAt: requests.createdAt,
      patientName: users.name,
    })
    .from(requests)
    .innerJoin(users, eq(requests.patientId, users.id))
    .where(eq(requests.status, "pending"));

  const myJobs = await db
    .select({
      id: requests.id,
      medicines: requests.medicines,
      address: requests.address,
      status: requests.status,
      createdAt: requests.createdAt,
    })
    .from(requests)
    .where(eq(requests.deliveryId, user.id));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">سفارشات</h1>
          <p className="text-muted-foreground">سفارشات در انتظار و سفارشات شما</p>
        </div>
        <OnlineToggle initialOnline={user.isOnline ?? false} />
      </div>

      <JobsList pending={pending} myJobs={myJobs} />
    </div>
  );
}
