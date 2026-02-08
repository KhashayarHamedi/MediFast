"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfile } from "@/actions/profile";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

type UserData = {
  id: string;
  name: string;
  phone: string;
  address: string;
  healthSummary: string;
  age: string;
  allergies: string;
  chronicDiseases: string;
  currentMeds: string;
};

export function ProfileForm({ user }: { user: UserData }) {
  const [healthSummary, setHealthSummary] = useState(user.healthSummary);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "fa-IR";
      rec.onresult = (e: SpeechRecognitionEvent) => {
        const t = Array.from(e.results).map((r) => r[0].transcript).join("");
        setHealthSummary((prev) => prev + t);
      };
      setRecognition(rec);
    }
  }, []);

  const toggleVoice = useCallback(() => {
    if (!recognition) {
      toast.info("پشتیبانی مرورگر از تشخیص صوت فعال نیست");
      return;
    }
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  }, [recognition, isRecording]);

  async function onSubmit(formData: FormData) {
    formData.set("healthSummary", healthSummary);
    const result = await updateProfile({
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      address: (formData.get("address") as string) || undefined,
      healthSummary: healthSummary || undefined,
      age: (formData.get("age") as string) || undefined,
      allergies: (formData.get("allergies") as string) || undefined,
      chronicDiseases: (formData.get("chronicDiseases") as string) || undefined,
      currentMeds: (formData.get("currentMeds") as string) || undefined,
    });
    if (result?.error) {
      toast.error(String(Object.values(result.error).flat()[0]));
    } else {
      toast.success("پروفایل به‌روزرسانی شد");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>پروفایل</CardTitle>
        <CardDescription>اطلاعات و خلاصه سلامت (برای امنیت توصیه می‌شود)</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">نام</Label>
            <Input id="name" name="name" defaultValue={user.name} required aria-label="نام" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">شماره تلفن</Label>
            <Input id="phone" name="phone" defaultValue={user.phone} required aria-label="تلفن" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">آدرس</Label>
            <Input id="address" name="address" defaultValue={user.address} placeholder="آدرس تحویل" aria-label="آدرس" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="healthSummary">خلاصه سلامت</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleVoice}
                aria-label={isRecording ? "توقف صدای متن" : "صدای متن"}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isRecording ? "توقف" : "صدای متن"}
              </Button>
            </div>
            <Textarea
              id="healthSummary"
              name="healthSummary"
              value={healthSummary}
              onChange={(e) => setHealthSummary(e.target.value)}
              placeholder="سن، حساسیت‌ها، بیماری‌های مزمن، داروهای فعلی..."
              rows={4}
              aria-label="خلاصه سلامت"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">سن</Label>
              <Input id="age" name="age" defaultValue={user.age} placeholder="مثال: ۶۵" aria-label="سن" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">حساسیت‌ها</Label>
              <Input id="allergies" name="allergies" defaultValue={user.allergies} placeholder="پنی‌سیلین، ..." aria-label="حساسیت" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="chronicDiseases">بیماری‌های مزمن</Label>
            <Input id="chronicDiseases" name="chronicDiseases" defaultValue={user.chronicDiseases} placeholder="دیابت، فشار خون، ..." aria-label="بیماری مزمن" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentMeds">داروهای فعلی</Label>
            <Input id="currentMeds" name="currentMeds" defaultValue={user.currentMeds} placeholder="لیست داروها" aria-label="داروهای فعلی" />
          </div>
          <Button type="submit">ذخیره</Button>
        </form>
      </CardContent>
    </Card>
  );
}
