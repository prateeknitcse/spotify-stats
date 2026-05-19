"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mic2, Music, Tag, BarChart2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/shared/StatCard";
import { StatCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { spotifyClient } from "@/lib/spotify/client";
import { QUERY_KEYS } from "@/lib/constants";
import { aggregateGenres, formatNumber } from "@/lib/utils";

// ─── StatsOverview ────────────────────────────────────────────────────────────
// Four metric cards at the top of the dashboard.
// Derives genre count from top artists data — no extra API call.

export function StatsOverview() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const { data: artists, isLoading: artistsLoading } = useQuery({
    queryKey: QUERY_KEYS.topArtists("medium_term"),
    queryFn: () => spotifyClient.getTopArtists(accessToken!, "medium_term", 50),
    enabled: !!accessToken,
  });

  const { data: tracks, isLoading: tracksLoading } = useQuery({
    queryKey: QUERY_KEYS.topTracks("medium_term"),
    queryFn: () => spotifyClient.getTopTracks(accessToken!, "medium_term", 50),
    enabled: !!accessToken,
  });

  const isLoading = artistsLoading || tracksLoading;

  // Derive unique genre count from top artists
  const genreCount = artists
    ? aggregateGenres(artists.items.map((a) => a.genres)).length
    : 0;

  // Average popularity across top tracks
  const avgPopularity = tracks?.items.length
    ? Math.round(
        tracks.items.reduce((sum, t) => sum + t.popularity, 0) /
          tracks.items.length
      )
    : 0;

  const stats = [
    {
      icon: Mic2,
      value: isLoading ? "—" : formatNumber(artists?.total ?? 0),
      label: "Top Artists",
      sublabel: "Last 6 months",
      href: "/dashboard/artists",
    },
    {
      icon: Music,
      value: isLoading ? "—" : formatNumber(tracks?.total ?? 0),
      label: "Top Tracks",
      sublabel: "Last 6 months",
      href: "/dashboard/tracks",
    },
    {
      icon: Tag,
      value: isLoading ? "—" : genreCount,
      label: "Unique Genres",
      sublabel: "In your taste profile",
      href: "/dashboard/genres",
    },
    {
      icon: BarChart2,
      value: isLoading ? "—" : `${avgPopularity}%`,
      label: "Avg Popularity",
      sublabel: "Across top tracks",
      href: "/dashboard/tracks",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat, i) =>
        isLoading ? (
          <StatCardSkeleton key={i} />
        ) : (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <StatCard
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              sublabel={stat.sublabel}
              onClick={() => router.push(stat.href)}
            />
          </motion.div>
        )
      )}
    </div>
  );
}
