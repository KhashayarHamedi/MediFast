"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createRequest } from "@/actions/request";
import { uploadPrescription } from "@/actions/upload";
import { Loader2, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

type RequestFormProps = {
  savedAddress: string | null;
  recentMeds: string | null;
};

export function RequestForm({ savedAddress, recentMeds }: RequestFormProps) {
  const t = useTranslations("requestForm");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [medicines, setMedicines] = useState(recentMeds || "");
  const [address, setAddress] = useState(savedAddress || "");
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
        setMedicines((prev) => prev + text);
      };
      setRecognition(rec);
    }
  }, [voiceLang]);

  const toggleVoice = useCallback(() => {
    if (!recognition) {
      toast.info("Voice recognition not supported");
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

  const useSavedAddress = useCallback(() => {
    if (savedAddress) {
      setAddress(savedAddress);
      toast.success("Address filled from profile");
    }
  }, [savedAddress]);

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
      toast.success(t("uploaded"));
    }
  }

  async function onSubmit(formData: FormData) {
    const meds = (formData.get("medicines") as string) || medicines;
    const addr = (formData.get("address") as string) || address;
    if (!meds.trim()) {
      toast.error("Please enter medicines");
      return;
    }
    if (!addr.trim()) {
      toast.error("Please enter delivery address");
      return;
    }
    const result = await createRequest({
      medicines: meds,
      address: addr,
      paymentMethod: "cash",
      notes: (formData.get("notes") as string) || undefined,
      prescriptionPhotoUrl: photoUrl || undefined,
    });
    if (result?.error) {
      const msg = Object.values(result.error).flat()[0];
      toast.error(typeof msg === "string" ? msg : tCommon("error"));
    } else {
      toast.success(t("created"));
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t("title")}</CardTitle>
        <CardDescription className="text-base">{t("subtitle")}</CardDescription>
        <p className="mt-2 rounded-md border border-muted bg-accent-warm/15 px-3 py-2 text-sm text-foreground dark:bg-accent-warm/10" role="doc-tip">
          {t("legalReminder")}
        </p>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="prescription" className="text-base">{t("prescriptionPhoto")}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="prescription"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                aria-label={t("prescriptionPhoto")}
                className="text-base"
              />
              {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
              {photoUrl && (
                <span className="text-base text-green-600 dark:text-green-400">{t("uploaded")}</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="medicines" className="text-base">{t("medicines")}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleVoice}
                aria-label={t("voiceMedicines")}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {t("voiceMedicines")}
              </Button>
            </div>
            <Textarea
              id="medicines"
              name="medicines"
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              placeholder={t("medicinesPlaceholder")}
              rows={3}
              required
              aria-label={t("medicines")}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="address" className="text-base">{t("address")}</Label>
              {savedAddress && (
                <Button type="button" variant="ghost" size="sm" onClick={useSavedAddress}>
                  {t("useSavedAddress")}
                </Button>
              )}
            </div>
            <Input
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("addressPlaceholder")}
              required
              aria-label={t("address")}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base">{t("notes")}</Label>
            <Textarea id="notes" name="notes" placeholder="..." rows={2} aria-label={t("notes")} className="text-base" />
          </div>
          <p className="text-base text-muted-foreground">{t("paymentCash")}</p>
          <Button type="submit" size="lg" className="h-12 min-w-[180px] text-base">
            {t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
