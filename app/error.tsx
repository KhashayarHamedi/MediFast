"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>خطایی رخ داد</CardTitle>
          <CardDescription>
            متأسفیم. لطفاً دوباره تلاش کنید.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={reset}>تلاش مجدد</Button>
          <Link href="/">
            <Button variant="outline">بازگشت به صفحه اصلی</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
