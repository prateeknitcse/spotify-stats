"use client";

import { useSession } from "next-auth/react";

// ─── useSpotifySession ────────────────────────────────────────────────────────
// Typed wrapper around NextAuth's useSession.
// Provides accessToken and user with Spotify-specific shape.
// All components use this — never useSession() directly.

export interface SpotifySession {
  accessToken: string | null;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useSpotifySession(): SpotifySession {
  const { data: session, status } = useSession();

  return {
    accessToken: (session as any)?.accessToken ?? null,
    user: session?.user ?? null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
