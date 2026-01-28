import { Skeleton } from "@/components/ui/skeleton";

export default function GuidesLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-3 h-4 w-72" />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
