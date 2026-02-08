"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function setDeliveryOnline(online: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "وارد شوید" };

  const [dbUser] = await db.select().from(users).where(eq(users.supabaseAuthId, user.id));
  if (!dbUser || dbUser.role !== "delivery") return { error: "فقط پیک می‌تواند" };

  await db
    .update(users)
    .set({ isOnline: online, updatedAt: new Date() })
    .where(eq(users.id, dbUser.id));

  revalidatePath("/dashboard", "layout");
  return { success: true };
}
