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
  const {
    email,
    password,
    name,
    phone,
    role,
    plz,
    street,
    houseNumber,
    dateOfBirth,
    idDocumentUrl,
    vehicleType,
  } = parsed.data;

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: { _form: [authError.message] } };
  }

  const address =
    street && houseNumber && plz
      ? `${street} ${houseNumber}, ${plz} Wien`
      : undefined;

  if (authData.user) {
    await db.insert(users).values({
      supabaseAuthId: authData.user.id,
      role,
      name,
      phone,
      email,
      plz: plz ?? undefined,
      street: street ?? undefined,
      houseNumber: houseNumber ?? undefined,
      address,
      dateOfBirth: dateOfBirth ?? undefined,
      idDocumentUrl: idDocumentUrl ?? undefined,
      vehicleType: vehicleType ?? undefined,
    });
  }

  const locale = (await headers()).get("x-next-locale") || "de";
  revalidatePath("/", "layout");
  redirect(`/${locale}/login?registered=1`);
}

/** Sign up from form (supports courier ID file upload via FormData) */
export async function signUpFromForm(formData: FormData) {
  const role = formData.get("role") as "patient" | "delivery";
  const idFile = role === "delivery" ? (formData.get("idDocument") as File | null) : null;

  const input: SignUpInput = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    role,
    plz: (formData.get("plz") as string) || undefined,
    street: (formData.get("street") as string) || undefined,
    houseNumber: (formData.get("houseNumber") as string) || undefined,
    dateOfBirth: (formData.get("dateOfBirth") as string) || undefined,
    vehicleType: (formData.get("vehicleType") as string) || undefined,
    idDocumentUrl: role === "delivery" && idFile && idFile.size > 0 ? "pending" : undefined,
  };

  if (role === "delivery" && (!idFile || idFile.size === 0)) {
    return { error: { _form: ["ID document required for couriers"] } };
  }

  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (authError) {
    return { error: { _form: [authError.message] } };
  }

  let idDocumentUrl: string | undefined;
  if (authData.user && role === "delivery" && idFile && idFile.size > 0) {
    const ext = idFile.name.split(".").pop() || "jpg";
    const path = `${authData.user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("id-documents").upload(path, idFile, {
      cacheControl: "3600",
      upsert: false,
    });
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("id-documents").getPublicUrl(path);
      idDocumentUrl = urlData.publicUrl;
    }
  }

  const address =
    parsed.data.street && parsed.data.houseNumber && parsed.data.plz
      ? `${parsed.data.street} ${parsed.data.houseNumber}, ${parsed.data.plz} Wien`
      : undefined;

  if (authData.user) {
    await db.insert(users).values({
      supabaseAuthId: authData.user.id,
      role: parsed.data.role,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      plz: parsed.data.plz ?? undefined,
      street: parsed.data.street ?? undefined,
      houseNumber: parsed.data.houseNumber ?? undefined,
      address,
      dateOfBirth: parsed.data.dateOfBirth ?? undefined,
      idDocumentUrl: idDocumentUrl ?? undefined,
      vehicleType: parsed.data.vehicleType ?? undefined,
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
