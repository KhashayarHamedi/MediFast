import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      <p className="text-lg text-muted-foreground">We&apos;re on it. Please wait a moment.</p>
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}
