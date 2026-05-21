"use client";

import { useSession } from "next-auth/react";

export interface SpotifySession {
  accessToken: string | null;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasError: boolean;
}

export function useSpotifySession(): SpotifySession {
  const { data: session, status } = useSession();
  return {
    accessToken: (session as any)?.accessToken ?? null,
    user: session?.user ?? null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    hasError: (session as any)?.error === "RefreshAccessTokenError",
  };
}
