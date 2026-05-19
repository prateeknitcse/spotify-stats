"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mic2, Music } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { TrackRowSkeleton, ArtistCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppStore } from "@/stores/useAppStore";
import { spotifyClient } from "@/lib/spotify/client";
import { QUERY_KEYS, TIME_RANGE_OPTIONS } from "@/lib/constants";
import { getBestImage, truncate, formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ─── QuickTopArtists ──────────────────────────────────────────────────────────
// Shows top 5 artists as a compact grid preview on the dashboard.

export function QuickTopArtists() {
  const { accessToken } = useAuth();
  const { selectedTimeRange } = useAppStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.topArtists(selectedTimeRange),
    queryFn: () => spotifyClient.getTopArtists(accessToken!, selectedTimeRange, 6),
    enabled: !!accessToken,
  });

  const timeLabel = TIME_RANGE_OPTIONS.find(
    (o) => o.value === selectedTimeRange
  )?.label;

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Top Artists"
        subtitle={timeLabel}
        icon={Mic2}
        action={
          <Link
            href="/dashboard/artists"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      {error && (
        <ErrorState compact message="Could not load top artists." onRetry={refetch} />
      )}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <ArtistCardSkeleton key={i} />)
          : data?.items.slice(0, 6).map((artist, i) => (
              <motion.a
                key={artist.id}
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center transition-all hover:border-primary/30 hover:bg-card/80"
              >
                {/* Rank badge */}
                <div className="relative w-full">
                  <div className="relative mx-auto h-16 w-16">
                    <Image
                      src={getBestImage(artist.images, "small")}
                      alt={artist.name}
                      fill
                      sizes="64px"
                      className="rounded-full object-cover ring-2 ring-border transition-all group-hover:ring-primary/40"
                    />
                  </div>
                  <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>

                <div className="w-full">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {truncate(artist.name, 14)}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {truncate(artist.genres[0] ?? "Artist", 14)}
                  </p>
                </div>
              </motion.a>
            ))}
      </div>
    </section>
  );
}

// ─── QuickTopTracks ───────────────────────────────────────────────────────────
// Shows top 5 tracks as a compact list preview on the dashboard.

export function QuickTopTracks() {
  const { accessToken } = useAuth();
  const { selectedTimeRange } = useAppStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.topTracks(selectedTimeRange),
    queryFn: () => spotifyClient.getTopTracks(accessToken!, selectedTimeRange, 5),
    enabled: !!accessToken,
  });

  const timeLabel = TIME_RANGE_OPTIONS.find(
    (o) => o.value === selectedTimeRange
  )?.label;

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Top Tracks"
        subtitle={timeLabel}
        icon={Music}
        action={
          <Link
            href="/dashboard/tracks"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      {error && (
        <ErrorState compact message="Could not load top tracks." onRetry={refetch} />
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={cn(i !== 4 && "border-b border-border")}>
                <TrackRowSkeleton />
              </div>
            ))
          : data?.items.map((track, i) => {
              const artists = track.artists.map((a) => a.name).join(", ");
              return (
                <motion.a
                  key={track.id}
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50",
                    i !== (data?.items.length ?? 1) - 1 && "border-b border-border"
                  )}
                >
                  {/* Rank */}
                  <span className="w-5 flex-shrink-0 text-center text-sm font-bold text-muted-foreground/60">
                    {i + 1}
                  </span>

                  {/* Album art */}
                  <div className="relative h-11 w-11 flex-shrink-0">
                    <Image
                      src={getBestImage(track.album.images, "small")}
                      alt={track.album.name}
                      fill
                      sizes="44px"
                      className="rounded-lg object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {truncate(track.name, 36)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {truncate(artists, 36)}
                    </p>
                  </div>

                  {/* Duration */}
                  <span className="flex-shrink-0 text-xs text-muted-foreground">
                    {formatDuration(track.duration_ms)}
                  </span>
                </motion.a>
              );
            })}
      </div>
    </section>
  );
}
