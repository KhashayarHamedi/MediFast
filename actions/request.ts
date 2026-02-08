"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { requests, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createRequestSchema, type CreateRequestInput } from "@/lib/validations/request";

export async function createRequest(
  input: CreateRequestInput & { prescriptionPhotoUrl?: string }
) {
  const parsed = createRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { _form: ["وارد شوید"] } };

  const [dbUser] = await db.select().from(users).where(eq(users.supabaseAuthId, user.id));
  if (!dbUser) return { error: { _form: ["کاربر یافت نشد"] } };
  if (dbUser.role !== "patient") return { error: { _form: ["فقط بیماران می‌توانند درخواست ثبت کنند"] } };

  await db.insert(requests).values({
    patientId: dbUser.id,
    medicines: parsed.data.medicines,
    address: parsed.data.address || dbUser.address || "",
    prescriptionPhotoUrl: input.prescriptionPhotoUrl,
    paymentMethod: parsed.data.paymentMethod,
    notes: parsed.data.notes,
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function acceptRequest(requestId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "وارد شوید" };

  const [dbUser] = await db.select().from(users).where(eq(users.supabaseAuthId, user.id));
  if (!dbUser || dbUser.role !== "delivery") return { error: "فقط پیک می‌تواند قبول کند" };

  await db
    .update(requests)
    .set({ deliveryId: dbUser.id, status: "accepted", updatedAt: new Date() })
    .where(eq(requests.id, requestId));

  revalidatePath("/dashboard/jobs");
  return { success: true };
}

export async function updateRequestStatus(
  requestId: string,
  status: "picked_up" | "delivering" | "delivered"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "وارد شوید" };

  const [dbUser] = await db.select().from(users).where(eq(users.supabaseAuthId, user.id));
  if (!dbUser) return { error: "کاربر یافت نشد" };

  await db
    .update(requests)
    .set({ status, updatedAt: new Date() })
    .where(eq(requests.id, requestId));

  revalidatePath("/dashboard");
  return { success: true };
}
