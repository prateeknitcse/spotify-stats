import type { TimeRangeOption } from "@/types";

// ─── Time Range Options ───────────────────────────────────────────────────────

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  {
    label: "Last 4 Weeks",
    value: "short_term",
    description: "Your recent listening habits",
  },
  {
    label: "Last 6 Months",
    value: "medium_term",
    description: "Your medium-term taste",
  },
  {
    label: "All Time",
    value: "long_term",
    description: "Your overall music identity",
  },
];

// ─── Spotify OAuth Scopes ─────────────────────────────────────────────────────

export const SPOTIFY_SCOPES = [
  "user-read-email",
  "user-read-private",
  "user-top-read",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-read-currently-playing",
].join(" ");

// ─── API Limits ───────────────────────────────────────────────────────────────

export const MAX_TOP_ITEMS = 50;
export const DEFAULT_TOP_ITEMS_LIMIT = 20;
export const RECENTLY_PLAYED_LIMIT = 50;

// ─── TanStack Query Keys ──────────────────────────────────────────────────────
// Centralized query keys prevent cache invalidation bugs.
// Using "as const" ensures TypeScript infers literal tuple types.

export const QUERY_KEYS = {
  profile: ["spotify", "profile"] as const,
  topArtists: (timeRange: string) =>
    ["spotify", "top-artists", timeRange] as const,
  topTracks: (timeRange: string) =>
    ["spotify", "top-tracks", timeRange] as const,
  recentlyPlayed: ["spotify", "recently-played"] as const,
  currentlyPlaying: ["spotify", "currently-playing"] as const,
  audioFeatures: (trackIds: string[]) =>
    ["spotify", "audio-features", ...trackIds] as const,
} as const;

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Top Artists", href: "/dashboard/artists", icon: "Mic2" },
  { label: "Top Tracks", href: "/dashboard/tracks", icon: "Music" },
  { label: "Genres", href: "/dashboard/genres", icon: "Tag" },
  { label: "Listening Patterns", href: "/dashboard/patterns", icon: "BarChart2" },
  { label: "Personality", href: "/dashboard/personality", icon: "Sparkles" },
] as const;

// ─── Chart Colors ─────────────────────────────────────────────────────────────
// Spotify-inspired palette for all data visualizations

export const CHART_COLORS = {
  primary: "#1DB954",
  secondary: "#1ed760",
  accent: "#ff6b6b",
  purple: "#b197fc",
  blue: "#74c0fc",
  orange: "#ffa94d",
  pink: "#f783ac",
  teal: "#63e6be",
  muted: "#495057",
  gradient: {
    green: ["#1DB954", "#145F30"],
    purple: ["#b197fc", "#5f3dc4"],
    blue: ["#74c0fc", "#1971c2"],
  },
} as const;

// ─── Mood Definitions ─────────────────────────────────────────────────────────

export const MOOD_DEFINITIONS = {
  euphoric: { emoji: "🎉", label: "Euphoric", color: "#ffd43b" },
  energetic: { emoji: "⚡", label: "Energetic", color: "#ff6b6b" },
  chill: { emoji: "😌", label: "Chill", color: "#74c0fc" },
  melancholic: { emoji: "🌧️", label: "Melancholic", color: "#845ef7" },
  focused: { emoji: "🎯", label: "Focused", color: "#1DB954" },
  romantic: { emoji: "💖", label: "Romantic", color: "#f783ac" },
} as const;
