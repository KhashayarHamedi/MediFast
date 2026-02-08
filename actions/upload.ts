"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadPrescription(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file) return { error: "فایلی انتخاب نشده" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "وارد شوید" };

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from("prescriptions").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) return { error: error.message };

  // For public bucket: use public URL. For private: use createSignedUrl (see README)
  const { data: urlData } = supabase.storage.from("prescriptions").getPublicUrl(path);
  return { url: urlData.publicUrl };
}
