"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

// ─── useAuth ──────────────────────────────────────────────────────────────────
// Single source of truth for auth state throughout the app.
// Wraps NextAuth's useSession with typed return values and convenience actions.
// No component imports useSession directly — they all use this hook.

export interface AuthState {
  /** Spotify access token — pass to API calls */
  accessToken: string | null;
  /** Whether the user is signed in */
  isAuthenticated: boolean;
  /** Session loading (initial hydration) */
  isLoading: boolean;
  /** Token refresh failed — user needs to re-login */
  hasError: boolean;
  /** User's basic profile from the session */
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
  } | null;
  /** Trigger Spotify OAuth flow */
  login: () => Promise<void>;
  /** Sign out and redirect to landing */
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = useCallback(async () => {
    await signIn("spotify", {
      callbackUrl: "/dashboard",
    });
  }, []);

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }, [router]);

  return {
    accessToken: session?.accessToken ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    hasError: session?.error === "RefreshAccessTokenError",
    user: session?.user ?? null,
    login,
    logout,
  };
}
