"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { setDeliveryOnline } from "@/actions/delivery";
import { toast } from "sonner";
import { Radio, Power } from "lucide-react";

export function OnlineToggle({ initialOnline }: { initialOnline: boolean }) {
  const [online, setOnline] = useState(initialOnline);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const result = await setDeliveryOnline(!online);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      setOnline(!online);
      toast.success(online ? "آفلاین شدید" : "آنلاین شدید");
    }
  }

  return (
    <Button
      variant={online ? "default" : "outline"}
      size="sm"
      onClick={toggle}
      disabled={loading}
      className="gap-2"
    >
      {online ? <Radio className="h-4 w-4" /> : <Power className="h-4 w-4" />}
      {online ? "آنلاین" : "آفلاین"}
    </Button>
  );
}
