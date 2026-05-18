import type { NextAuthOptions, Session, Account } from "next-auth";
import type { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";
import { refreshAccessToken, SPOTIFY_SCOPES } from "@/lib/spotify/auth";

// ─── NextAuth Configuration ───────────────────────────────────────────────────
// Centralized here so it can be imported by both the route handler
// and server components / server actions without duplication.

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request all scopes we need upfront.
          // Asking for more later requires re-auth.
          scope: SPOTIFY_SCOPES,
        },
      },
    }),
  ],

  // JWT strategy — no database needed.
  // Token stored in encrypted httpOnly cookie.
  session: {
    strategy: "jwt",
    // Session valid for 1 hour (matches Spotify token lifetime)
    maxAge: 60 * 60,
  },

  callbacks: {
    // ── jwt callback ─────────────────────────────────────────────────────────
    // Called whenever a JWT is created or updated.
    // On initial sign-in, `account` contains the Spotify OAuth tokens.
    // On subsequent calls, we check if the token needs refreshing.
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      // Initial sign-in: store Spotify tokens in the JWT
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          // Spotify tokens expire in 3600s — store absolute expiry timestamp
          accessTokenExpires: Date.now() + (account.expires_in as number) * 1000,
        };
      }

      // Token still valid — return as-is
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Token expired — refresh it
      try {
        const refreshed = await refreshAccessToken(token.refreshToken as string);
        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          accessTokenExpires: refreshed.accessTokenExpires,
          error: undefined, // Clear any previous error
        };
      } catch (error) {
        console.error("[NextAuth] Token refresh failed:", error);
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },

    // ── session callback ──────────────────────────────────────────────────────
    // Called whenever a session is checked (useSession, getServerSession).
    // Exposes the accessToken to the client — but NOT the refreshToken.
    // Never expose the refresh token to the browser.
    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        accessToken: token.accessToken as string,
        error: token.error as string | undefined,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
  },

  pages: {
    // Custom sign-in page (our polished landing page)
    signIn: "/",
    // On error, redirect back to landing with error param
    error: "/",
  },

  // Enable debug logs only in development
  debug: process.env.NODE_ENV === "development",
};
