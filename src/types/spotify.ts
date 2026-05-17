// ============================================================
// Spotify Web API — TypeScript type definitions
// All shapes defined here before any component touches data.
// ============================================================

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyUser {
  id: string;
  display_name: string | null;
  email: string;
  images: SpotifyImage[];
  followers: { total: number };
  country: string;
  product: "free" | "premium";
  uri: string;
  external_urls: { spotify: string };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  genres: string[];
  popularity: number;
  external_urls: { spotify: string };
  followers: { total: number };
  uri: string;
  type: "artist";
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  total_tracks: number;
  album_type: "album" | "single" | "compilation";
  external_urls: { spotify: string };
  artists: Pick<SpotifyArtist, "id" | "name" | "external_urls">[];
  uri: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Pick<SpotifyArtist, "id" | "name" | "external_urls">[];
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
  explicit: boolean;
  external_urls: { spotify: string };
  preview_url: string | null;
  uri: string;
  type: "track";
  is_local: boolean;
}

// Time range options for top items API
export type TimeRange = "short_term" | "medium_term" | "long_term";

// Paginated response shape from Spotify
export interface TopItemsResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

export interface RecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string; // ISO 8601 timestamp
  context: {
    type: "album" | "artist" | "playlist";
    href: string;
    external_urls: { spotify: string };
    uri: string;
  } | null;
}

export interface SpotifyRecentlyPlayed {
  items: RecentlyPlayedItem[];
  cursors: {
    after: string;
    before: string;
  };
  limit: number;
  next: string | null;
  href: string;
}

export interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  progress_ms: number | null;
  item: SpotifyTrack | null;
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
  timestamp: number;
}

// For genre analytics — derived type, not from API directly
export interface GenreCount {
  genre: string;
  count: number;
  percentage: number;
}

// For audio features (if we add this in a future module)
export interface SpotifyAudioFeatures {
  id: string;
  danceability: number;    // 0–1
  energy: number;          // 0–1
  key: number;             // 0–11
  loudness: number;        // dB
  mode: 0 | 1;             // minor=0, major=1
  speechiness: number;     // 0–1
  acousticness: number;    // 0–1
  instrumentalness: number; // 0–1
  liveness: number;        // 0–1
  valence: number;         // 0–1 (musical positiveness)
  tempo: number;           // BPM
  duration_ms: number;
  time_signature: number;
}
