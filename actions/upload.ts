"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadPrescription(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file selected" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in" };

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from("prescriptions").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage.from("prescriptions").getPublicUrl(path);
  return { url: urlData.publicUrl };
}

/** Courier ID document (Führerschein / Personalausweis) – private bucket */
export async function uploadIdDocument(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file selected" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in" };

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from("id-documents").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage.from("id-documents").getPublicUrl(path);
  return { url: urlData.publicUrl };
}
