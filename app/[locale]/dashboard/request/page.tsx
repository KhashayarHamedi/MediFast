"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createRequest } from "@/actions/request";
import { uploadPrescription } from "@/actions/upload";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RequestPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadPrescription(formData);
    setUploading(false);
    if (result.error) {
      toast.error(result.error);
    } else if (result.url) {
      setPhotoUrl(result.url);
      toast.success("تصویر نسخه آپلود شد");
    }
  }

  async function onSubmit(formData: FormData) {
    const medicines = formData.get("medicines") as string;
    const address = formData.get("address") as string;
    if (!medicines.trim()) {
      toast.error("داروها را وارد کنید");
      return;
    }
    if (!address.trim()) {
      toast.error("آدرس تحویل را وارد کنید");
      return;
    }
    const result = await createRequest({
      medicines,
      address,
      paymentMethod: "cash",
      notes: (formData.get("notes") as string) || undefined,
      prescriptionPhotoUrl: photoUrl || undefined,
    });
    if (result?.error) {
      const msg = Object.values(result.error).flat()[0];
      toast.error(typeof msg === "string" ? msg : "خطا");
    } else {
      toast.success("درخواست ثبت شد");
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>درخواست دارو</CardTitle>
        <CardDescription>
          نسخه آپلود کنید یا داروهای بدون نسخه را بنویسید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>تصویر نسخه (اختیاری)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                aria-label="آپلود نسخه"
              />
              {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
              {photoUrl && (
                <span className="text-sm text-green-600 dark:text-green-400">آپلود شد</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="medicines">داروها *</Label>
            <Textarea
              id="medicines"
              name="medicines"
              placeholder="مثال: استامینوفن ۵۰۰، ویتامین C، ..."
              rows={3}
              required
              aria-label="داروها"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">آدرس تحویل *</Label>
            <Input
              id="address"
              name="address"
              placeholder="آدرس کامل تحویل"
              required
              aria-label="آدرس تحویل"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">توضیحات (اختیاری)</Label>
            <Textarea id="notes" name="notes" placeholder="..." rows={2} aria-label="توضیحات" />
          </div>
          <p className="text-sm text-muted-foreground">پرداخت نقدی در محل (پیش‌فرض)</p>
          <Button type="submit">ثبت درخواست</Button>
        </form>
      </CardContent>
    </Card>
  );
}
