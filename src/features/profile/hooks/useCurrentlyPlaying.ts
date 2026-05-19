"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { spotifyClient } from "@/lib/spotify/client";
import { QUERY_KEYS } from "@/lib/constants";
import type { SpotifyCurrentlyPlaying } from "@/types";

// ─── useCurrentlyPlaying ──────────────────────────────────────────────────────
// Polls the Spotify "currently playing" endpoint every 30 seconds.
// Returns null when nothing is playing (Spotify returns 204).
// Uses a short staleTime so the widget stays fresh.

export function useCurrentlyPlaying() {
  const { accessToken } = useAuth();

  return useQuery<SpotifyCurrentlyPlaying | null, Error>({
    queryKey: QUERY_KEYS.currentlyPlaying,
    queryFn: () => spotifyClient.getCurrentlyPlaying(accessToken!),
    enabled: !!accessToken,
    // Poll every 30 seconds — Spotify's recommended interval
    refetchInterval: 30 * 1000,
    // Consider data stale after 25 seconds (slightly before refetch)
    staleTime: 25 * 1000,
    // Don't throw on 204 No Content — treat as null
    retry: false,
  });
}
