import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);

  return (
    <ProfileForm
      user={{
        id: user.id,
        name: user.name,
        phone: user.phone,
        address: user.address ?? "",
        healthSummary: user.healthSummary ?? "",
        age: user.age ?? "",
        allergies: user.allergies ?? "",
        chronicDiseases: user.chronicDiseases ?? "",
        currentMeds: user.currentMeds ?? "",
      }}
    />
  );
}
