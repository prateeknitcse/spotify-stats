// ─── Centralized Spotify API Client ──────────────────────────────────────────
// All Spotify Web API calls flow through here.
// Never call fetch() directly from components or hooks.
// This is the only file that knows about the Spotify API shape.

import type {
  SpotifyUser,
  SpotifyArtist,
  SpotifyTrack,
  TopItemsResponse,
  SpotifyRecentlyPlayed,
  SpotifyCurrentlyPlaying,
  TimeRange,
} from "@/types";

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

// ─── HTTP Layer ───────────────────────────────────────────────────────────────

class SpotifyApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "SpotifyApiError";
  }
}

async function spotifyFetch<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${SPOTIFY_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new SpotifyApiError(
      response.status,
      error?.error?.message ?? `Spotify API error: ${response.status}`
    );
  }

  // Handle 204 No Content (e.g., currently playing when nothing is playing)
  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

// ─── API Methods ──────────────────────────────────────────────────────────────

export const spotifyClient = {
  // User profile
  getProfile: (accessToken: string) =>
    spotifyFetch<SpotifyUser>("/me", accessToken),

  // Top artists for a time range
  getTopArtists: (
    accessToken: string,
    timeRange: TimeRange = "medium_term",
    limit = 20,
    offset = 0
  ) =>
    spotifyFetch<TopItemsResponse<SpotifyArtist>>(
      `/me/top/artists?time_range=${timeRange}&limit=${limit}&offset=${offset}`,
      accessToken
    ),

  // Top tracks for a time range
  getTopTracks: (
    accessToken: string,
    timeRange: TimeRange = "medium_term",
    limit = 20,
    offset = 0
  ) =>
    spotifyFetch<TopItemsResponse<SpotifyTrack>>(
      `/me/top/tracks?time_range=${timeRange}&limit=${limit}&offset=${offset}`,
      accessToken
    ),

  // Recently played tracks
  getRecentlyPlayed: (accessToken: string, limit = 50) =>
    spotifyFetch<SpotifyRecentlyPlayed>(
      `/me/player/recently-played?limit=${limit}`,
      accessToken
    ),

  // Currently playing track
  getCurrentlyPlaying: (accessToken: string) =>
    spotifyFetch<SpotifyCurrentlyPlaying | null>(
      "/me/player/currently-playing",
      accessToken
    ),
};

export { SpotifyApiError };
