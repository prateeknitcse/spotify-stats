"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { spotifyClient } from "@/lib/spotify/client";
import { QUERY_KEYS, MAX_TOP_ITEMS } from "@/lib/constants";
import type { TimeRange } from "@/types";

// ─── useTopTracks ─────────────────────────────────────────────────────────────
// Fetches the user's top tracks for a given time range.

export function useTopTracks(timeRange: TimeRange) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.topTracks(timeRange),
    queryFn: () =>
      spotifyClient.getTopTracks(accessToken!, timeRange, MAX_TOP_ITEMS),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}
