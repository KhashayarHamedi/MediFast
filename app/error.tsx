"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/lib/navigation";

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
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription className="text-base">
            Here&apos;s what you can do: Try again or go back home. We&apos;re here to help.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} size="lg" className="flex-1 sm:flex-none">
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Back to home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
