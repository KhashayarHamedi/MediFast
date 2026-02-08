import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RequestForm } from "./request-form";

export default async function RequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ repeat?: string }>;
}) {
  const { locale } = await params;
  const { repeat } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);
  if (user.role !== "patient") redirect(`/${locale}/dashboard`);

  const savedAddress = user.address || null;
  const recentMeds = repeat || user.currentMeds || null;

  return (
    <div className="space-y-6">
      <RequestForm savedAddress={savedAddress} recentMeds={recentMeds} />
    </div>
  );
}
