// ─── NextAuth Type Extensions ─────────────────────────────────────────────────
// NextAuth's default Session and JWT types don't include our custom fields.
// Module augmentation extends them without touching next-auth source.
// This file is picked up automatically via tsconfig "include".

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    /** Spotify access token — available in useSession() and getServerSession() */
    accessToken: string;
    /** Set when token refresh fails — use to force re-login */
    error?: "RefreshAccessTokenError";
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
