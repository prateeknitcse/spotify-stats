"use client";

import { TrackRow, TrackRowHeader } from "./TrackRow";
import { TrackRowSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { useTopTracks } from "@/features/top-items/hooks/useTopTracks";
import { useAppStore } from "@/stores/useAppStore";

// ─── TrackList ────────────────────────────────────────────────────────────────
// Full paginated list of top tracks with column headers.

export function TrackList() {
  const { selectedTimeRange } = useAppStore();
  const { data, isLoading, error, refetch } = useTopTracks(selectedTimeRange);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {data ? `${data.items.length} tracks` : "Loading..."}
      </p>

      {error && (
        <ErrorState
          message="Could not load your top tracks."
          onRetry={refetch}
        />
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <TrackRowHeader />

        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <TrackRowSkeleton key={i} />
            ))
          : data?.items.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                rank={i + 1}
                index={i}
              />
            ))}
      </div>
    </div>
  );
}
