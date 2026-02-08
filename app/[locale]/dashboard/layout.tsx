import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const user = await getCurrentUser();
  const { locale } = await params;
  if (!user) redirect(`/${locale}/login`);

  return (
    <div className="min-h-screen">
      <DashboardNav user={user} />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
