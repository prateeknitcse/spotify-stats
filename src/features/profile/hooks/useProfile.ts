"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { spotifyClient } from "@/lib/spotify/client";
import { QUERY_KEYS } from "@/lib/constants";
import type { SpotifyUser } from "@/types";

// ─── useProfile ───────────────────────────────────────────────────────────────
// Fetches the authenticated user's Spotify profile.
// Enabled only when accessToken is available — never fires unauthenticated.

export function useProfile() {
  const { accessToken } = useAuth();

  return useQuery<SpotifyUser, Error>({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => spotifyClient.getProfile(accessToken!),
    enabled: !!accessToken,
    // Profile data rarely changes — cache aggressively
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
