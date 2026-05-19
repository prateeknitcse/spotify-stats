import { cn } from "@/lib/utils";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
// Base shimmer skeleton block. Compose these to match your layout shape.

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("shimmer rounded-lg bg-muted", className)}
      aria-hidden="true"
    />
  );
}

// ─── Preset Skeletons ─────────────────────────────────────────────────────────

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
      <Skeleton className="h-28 w-28 rounded-full sm:h-36 sm:w-36" />
      <div className="flex flex-col items-center gap-3 sm:items-start">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-56" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Skeleton className="mb-3 h-4 w-4 rounded-md" />
      <Skeleton className="mb-2 h-7 w-20" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

export function CurrentlyPlayingSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <Skeleton className="h-14 w-14 flex-shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}

export function TrackRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl p-3">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-12 w-12 flex-shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>
      <Skeleton className="h-3 w-10" />
    </div>
  );
}

export function ArtistCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <Skeleton className="h-20 w-20 rounded-full" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}
