"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { acceptRequest, updateRequestStatus } from "@/actions/request";
import { toast } from "sonner";
import { Package, Check, Truck, MapPin } from "lucide-react";

type PendingJob = {
  id: string;
  medicines: string;
  address: string;
  status: string;
  createdAt: Date;
  patientName: string;
};

type MyJob = {
  id: string;
  medicines: string;
  address: string;
  status: string;
  createdAt: Date;
};

export function JobsList({ pending, myJobs }: { pending: PendingJob[]; myJobs: MyJob[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAccept(id: string) {
    setLoading(id);
    const result = await acceptRequest(id);
    setLoading(null);
    if (result?.error) toast.error(result.error);
    else toast.success("سفارش قبول شد");
  }

  async function handleStatus(id: string, status: "picked_up" | "delivering" | "delivered") {
    setLoading(id);
    const result = await updateRequestStatus(id, status);
    setLoading(null);
    if (result?.error) toast.error(result.error);
    else toast.success("وضعیت به‌روزرسانی شد");
  }

  const statusLabel: Record<string, string> = {
    pending: "در انتظار",
    accepted: "پذیرفته شده",
    picked_up: "از داروخانه دریافت شد",
    delivering: "در حال ارسال",
    delivered: "تحویل داده شد",
  };

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              سفارشات در انتظار
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pending.map((j) => (
              <div
                key={j.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{j.medicines}</p>
                  <p className="text-sm text-muted-foreground">{j.address}</p>
                  <p className="text-xs text-muted-foreground">{j.patientName}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAccept(j.id)}
                  disabled={loading === j.id}
                >
                  {loading === j.id ? "..." : "قبول سفارش"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            سفارشات من
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {myJobs.length === 0 ? (
            <p className="text-muted-foreground">هنوز سفارشی قبول نکرده‌اید</p>
          ) : (
            myJobs.map((j) => (
              <div
                key={j.id}
                className="rounded-lg border border-border p-4 space-y-3"
              >
                <div>
                  <p className="font-medium">{j.medicines}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {j.address}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {statusLabel[j.status] || j.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {j.status === "accepted" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatus(j.id, "picked_up")}
                      disabled={loading === j.id}
                    >
                      از داروخانه گرفتم
                    </Button>
                  )}
                  {j.status === "picked_up" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatus(j.id, "delivering")}
                      disabled={loading === j.id}
                    >
                      در حال ارسال
                    </Button>
                  )}
                  {j.status === "delivering" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatus(j.id, "delivered")}
                      disabled={loading === j.id}
                    >
                      <Check className="ml-1 h-4 w-4" />
                      تحویل دادم
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
