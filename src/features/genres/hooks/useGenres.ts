"use client";

import { useMemo } from "react";
import { useTopArtists } from "@/features/top-items/hooks/useTopArtists";
import { CHART_COLORS } from "@/lib/constants";
import { capitalize } from "@/lib/utils";
import type { TimeRange } from "@/types";

export interface GenreData {
  genre: string;
  count: number;
  percentage: number;
  color: string;
}

// ─── useGenres ────────────────────────────────────────────────────────────────
// Derives genre analytics from the top artists query.
// No extra API call — reuses TanStack Query cache.
// Returns genres sorted by count with assigned chart colors.

const PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.orange,
  CHART_COLORS.pink,
  CHART_COLORS.teal,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  "#a9e34b",
  "#66d9e8",
  "#ffd43b",
  "#e599f7",
];

export function useGenres(timeRange: TimeRange) {
  const { data, isLoading, error, refetch } = useTopArtists(timeRange);

  const genres = useMemo<GenreData[]>(() => {
    if (!data?.items.length) return [];

    const genreMap = new Map<string, number>();
    for (const artist of data.items) {
      for (const genre of artist.genres) {
        genreMap.set(genre, (genreMap.get(genre) ?? 0) + 1);
      }
    }

    const total = Array.from(genreMap.values()).reduce((a, b) => a + b, 0);

    return Array.from(genreMap.entries())
      .map(([genre, count], i) => ({
        genre: capitalize(genre),
        count,
        percentage: Math.round((count / total) * 100),
        color: PALETTE[i % PALETTE.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  return {
    genres,
    isLoading,
    error,
    refetch,
    totalArtists: data?.items.length ?? 0,
  };
}
