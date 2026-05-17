// ─── Spotify OAuth Helpers ────────────────────────────────────────────────────
// Used by NextAuth.js provider config and token refresh logic.

import { SPOTIFY_SCOPES } from "@/lib/constants";

export const SPOTIFY_AUTH_URL = "https://accounts.spotify.com";

// Refresh an expired access token using the refresh token.
// Spotify access tokens expire after 1 hour.
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
}> {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  const response = await fetch(`${SPOTIFY_AUTH_URL}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${data.error}`);
  }

  return {
    accessToken: data.access_token,
    // Spotify tokens expire in 3600s — refresh 60s early to be safe
    accessTokenExpires: Date.now() + (data.expires_in - 60) * 1000,
    // Spotify may return a new refresh token — use it if provided
    refreshToken: data.refresh_token ?? refreshToken,
  };
}

export { SPOTIFY_SCOPES };
