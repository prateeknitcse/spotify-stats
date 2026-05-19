import type { Metadata } from "next";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { CurrentlyPlaying } from "@/features/profile/components/CurrentlyPlaying";
import { StatsOverview } from "@/features/profile/components/StatsOverview";
import { QuickTopArtists, QuickTopTracks } from "@/features/profile/components/QuickTopItems";

export const metadata: Metadata = {
  title: "Dashboard",
};

// ─── Dashboard Overview Page ──────────────────────────────────────────────────
// Server component — data fetching happens inside each child client component
// via TanStack Query. This file is pure composition.

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Profile header */}
      <ProfileHeader />

      {/* Currently playing — hidden when nothing is playing */}
      <CurrentlyPlaying />

      {/* Stats overview cards */}
      <StatsOverview />

      {/* Quick previews */}
      <div className="grid gap-8 lg:grid-cols-2">
        <QuickTopArtists />
        <QuickTopTracks />
      </div>
    </div>
  );
}
