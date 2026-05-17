import type { TimeRange } from "./spotify";

export type ThemeMode = "dark" | "light" | "system";

export interface TimeRangeOption {
  label: string;
  value: TimeRange;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AppError {
  message: string;
  code?: string | number;
  retry?: () => void;
}

// Personality card data shape (Module 07)
export interface PersonalityCard {
  userId: string;
  displayName: string;
  avatarUrl: string;
  topArtists: string[];
  topGenres: string[];
  topTrack: string;
  mood: string;
  moodEmoji: string;
  listeningPersonality: string;
  generatedAt: string;
}
