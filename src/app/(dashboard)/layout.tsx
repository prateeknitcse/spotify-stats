import { AppShell } from "@/components/layout/AppShell";

// ─── Dashboard Layout ─────────────────────────────────────────────────────────
// Applied to all routes inside (dashboard)/ group.
// Wraps them in the AppShell (sidebar + topbar).
// Route groups don't affect the URL path — just the layout.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
