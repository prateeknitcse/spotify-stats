// Dashboard overview page — implemented fully in Module 03
// For now: confirms auth flow works end-to-end

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Dashboard</h1>
        <p className="text-muted-foreground">
          Auth is working. Profile + stats coming in Module 03.
        </p>
      </div>

      {/* Placeholder grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-border bg-card"
          />
        ))}
      </div>
    </div>
  );
}
