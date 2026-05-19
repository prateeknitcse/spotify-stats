"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { spotifyClient } from "@/lib/spotify/client";
import { QUERY_KEYS, MAX_TOP_ITEMS } from "@/lib/constants";
import type { TimeRange } from "@/types";

// ─── useTopArtists ────────────────────────────────────────────────────────────
// Fetches the user's top artists for a given time range.
// limit=50 fetches the maximum Spotify allows in one call.

export function useTopArtists(timeRange: TimeRange) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.topArtists(timeRange),
    queryFn: () =>
      spotifyClient.getTopArtists(accessToken!, timeRange, MAX_TOP_ITEMS),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}
