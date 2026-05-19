import type { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { refreshAccessToken, SPOTIFY_SCOPES } from "@/lib/spotify/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: { scope: SPOTIFY_SCOPES },
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },

  callbacks: {
    async jwt({ token, account }) {
      // First sign-in — store Spotify tokens
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: Date.now() + (account.expires_in as number) * 1000,
        };
      }

      // Token still valid
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Token expired — refresh
      try {
        const refreshed = await refreshAccessToken(token.refreshToken as string);
        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          accessTokenExpires: refreshed.accessTokenExpires,
          error: undefined,
        };
      } catch (error) {
        console.error("[Auth] Token refresh failed:", error);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },

    async session({ session, token }) {
      // Never expose refreshToken to the client
      return {
        ...session,
        accessToken: token.accessToken as string,
        error: token.error as string | undefined,
        user: { ...session.user, id: token.sub },
      };
    },
  },

  pages: {
    signIn: "/",
    error: "/",
  },

  // Helps diagnose issues in dev — disable in production
  debug: process.env.NODE_ENV === "development",

  secret: process.env.NEXTAUTH_SECRET,
};
