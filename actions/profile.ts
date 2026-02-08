"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";

export async function updateProfile(input: ProfileInput) {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { _form: ["وارد شوید"] } };

  await db
    .update(users)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(users.supabaseAuthId, user.id));

  revalidatePath("/dashboard", "layout");
  return { success: true };
}
