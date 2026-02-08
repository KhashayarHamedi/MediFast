"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function TrackingPoll({ requestId, isActive }: { requestId: string; isActive: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(interval);
  }, [requestId, isActive, router]);

  return null;
}
