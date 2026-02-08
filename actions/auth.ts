"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { signUpSchema, signInSchema, type SignUpInput, type SignInInput } from "@/lib/validations/auth";

export async function signUp(input: SignUpInput) {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { email, password, name, phone, role } = parsed.data;

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: { _form: [authError.message] } };
  }

  if (authData.user) {
    await db.insert(users).values({
      supabaseAuthId: authData.user.id,
      role,
      name,
      phone,
      email,
    });
  }

  const locale = (await headers()).get("x-next-locale") || "de";
  revalidatePath("/", "layout");
  redirect(`/${locale}/login?registered=1`);
}

export async function signIn(input: SignInInput) {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { email, password } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: { _form: [error.message] } };
  }

  const locale = (await headers()).get("x-next-locale") || "de";
  revalidatePath("/", "layout");
  redirect(`/${locale}/dashboard`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = (await headers()).get("x-next-locale") || "de";
  revalidatePath("/", "layout");
  redirect(`/${locale}`);
}
