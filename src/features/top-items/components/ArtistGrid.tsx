"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { ArtistCard } from "./ArtistCard";
import { ArtistCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { useTopArtists } from "@/features/top-items/hooks/useTopArtists";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";

// ─── ArtistGrid ───────────────────────────────────────────────────────────────
// Renders the full top artists list with a grid/list view toggle.
// Supports up to 50 results (Spotify API max).

export function ArtistGrid() {
  const { selectedTimeRange } = useAppStore();
  const { data, isLoading, error, refetch } = useTopArtists(selectedTimeRange);
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data ? `${data.items.length} artists` : "Loading..."}
        </p>

        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-border bg-card p-1">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "rounded-md p-1.5 transition-colors",
              view === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "rounded-md p-1.5 transition-colors",
              view === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="List view"
            aria-pressed={view === "list"}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <ErrorState
          message="Could not load your top artists."
          onRetry={refetch}
        />
      )}

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {isLoading
            ? Array.from({ length: 18 }).map((_, i) => (
                <ArtistCardSkeleton key={i} />
              ))
            : data?.items.map((artist, i) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  rank={i + 1}
                  index={i}
                  view="grid"
                />
              ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="space-y-2">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[72px] animate-pulse rounded-2xl border border-border bg-card"
                />
              ))
            : data?.items.map((artist, i) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  rank={i + 1}
                  index={i}
                  view="list"
                />
              ))}
        </div>
      )}
    </div>
  );
}
