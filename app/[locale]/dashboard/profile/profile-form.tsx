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
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

type UserData = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  plz: string;
  street: string;
  houseNumber: string;
  healthSummary: string;
  age: string;
  allergies: string;
  chronicDiseases: string;
  currentMeds: string;
};

export function ProfileForm({ user }: { user: UserData }) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const [healthSummary, setHealthSummary] = useState(user.healthSummary);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const voiceLang = locale === "de" ? "de-AT" : "en";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = voiceLang;
      rec.onresult = (e: SpeechRecognitionEvent) => {
        const text = Array.from(e.results).map((r) => r[0].transcript).join("");
        setHealthSummary((prev) => prev + text);
      };
      setRecognition(rec);
    }
  }, [voiceLang]);

  const toggleVoice = useCallback(() => {
    if (!recognition) {
      toast.info(t("voiceNotSupported"));
      return;
    }
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  }, [recognition, isRecording, t]);

  async function onSubmit(formData: FormData) {
    formData.set("healthSummary", healthSummary);
    const result = await updateProfile({
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: (formData.get("email") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      plz: (formData.get("plz") as string) || undefined,
      street: (formData.get("street") as string) || undefined,
      houseNumber: (formData.get("houseNumber") as string) || undefined,
      healthSummary: healthSummary || undefined,
      age: (formData.get("age") as string) || undefined,
      allergies: (formData.get("allergies") as string) || undefined,
      chronicDiseases: (formData.get("chronicDiseases") as string) || undefined,
      currentMeds: (formData.get("currentMeds") as string) || undefined,
    });
    if (result?.error) {
      toast.error(String(Object.values(result.error).flat()[0]));
    } else {
      toast.success(t("updated"));
    }
  }

  return (
    <Card className="border-white/10 bg-[#161b22]">
      <CardHeader>
        <CardTitle className="text-[#e2e8f0]">{t("title")}</CardTitle>
        <CardDescription className="text-[#8b949e]">{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#e2e8f0]">{t("name")}</Label>
            <Input id="name" name="name" defaultValue={user.name} required className="border-white/10 bg-[#0f1117] text-[#e2e8f0]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#e2e8f0]">{t("phone")}</Label>
            <Input id="phone" name="phone" defaultValue={user.phone} required className="border-white/10 bg-[#0f1117] text-[#e2e8f0]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#e2e8f0]">{t("email")}</Label>
            <Input id="email" name="email" type="email" defaultValue={user.email} className="border-white/10 bg-[#0f1117] text-[#e2e8f0]" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label htmlFor="plz" className="text-[#e2e8f0]">{t("plz")}</Label>
              <Input id="plz" name="plz" defaultValue={user.plz} placeholder="1010" className="border-white/10 bg-[#0f1117] text-[#e2e8f0]" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="street" className="text-[#e2e8f0]">{t("street")}</Label>
              <Input id="street" name="street" defaultValue={user.street} placeholder={t("street")} className="border-white/10 bg-[#0f1117] text-[#e2e8f0]" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="houseNumber" className="text-[#e2e8f0]">{t("houseNumber")}</Label>
            <Input id="houseNumber" name="houseNumber" defaultValue={user.houseNumber} placeholder="12" className="border-white/10 bg-[#0f1117] text-[#e2e8f0]" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="healthSummary" className="text-[#e2e8f0]">{t("healthSummary")}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleVoice}
                className="border-[#3b82f6]/50 text-[#3b82f6]"
                aria-label={isRecording ? t("stop") : t("voiceInput")}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isRecording ? t("stop") : t("voiceInput")}
              </Button>
            </div>
            <Textarea
              id="healthSummary"
              name="healthSummary"
              value={healthSummary}
              onChange={(e) => setHealthSummary(e.target.value)}
              placeholder={t("healthSummaryPlaceholder")}
              rows={4}
              className="border-white/10 bg-[#0f1117] text-[#e2e8f0]"
            />
            <p className="text-xs text-[#8b949e]">{t("healthSummaryHint")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-[#e2e8f0]">{t("age")}</Label>
              <Input id="age" name="age" defaultValue={user.age} placeholder={t("agePlaceholder")} className="border-white/10 bg-[#0f1117] text-[#e2e8f0]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies" className="text-[#e2e8f0]">{t("allergies")}</Label>
              <Input id="allergies" name="allergies" defaultValue={user.allergies} placeholder={t("allergiesPlaceholder")} className="border-white/10 bg-[#0f1117] text-[#e2e8f0]" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="chronicDiseases" className="text-[#e2e8f0]">{t("chronicDiseases")}</Label>
            <Input id="chronicDiseases" name="chronicDiseases" defaultValue={user.chronicDiseases} placeholder={t("chronicPlaceholder")} className="border-white/10 bg-[#0f1117] text-[#e2e8f0]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentMeds" className="text-[#e2e8f0]">{t("currentMeds")}</Label>
            <Input id="currentMeds" name="currentMeds" defaultValue={user.currentMeds} placeholder={t("currentMedsPlaceholder")} className="border-white/10 bg-[#0f1117] text-[#e2e8f0]" />
          </div>
          <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
            {t("save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
