// ─── Dashboard Loading UI ─────────────────────────────────────────────────────
// Next.js shows this instantly while the dashboard page streams in.
// Matches the AppShell layout so there is no layout shift.

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Profile header skeleton */}
      <div className="flex items-end gap-6">
        <div className="h-36 w-36 animate-pulse rounded-full bg-muted" />
        <div className="space-y-3 pb-1">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-9 w-56 animate-pulse rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </div>
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      {/* Content skeleton */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
