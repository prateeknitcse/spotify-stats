import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SpotifyImage } from "@/types";

// ─── Tailwind Class Merger ────────────────────────────────────────────────────
// Shadcn's standard — merges Tailwind classes safely, resolving conflicts.
// e.g., cn("px-2 py-1", "px-4") → "py-1 px-4"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Number Formatting ────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

// ─── Duration Formatting ──────────────────────────────────────────────────────

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatDurationLong(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

// ─── Image Utilities ──────────────────────────────────────────────────────────
// Spotify returns multiple image sizes. This helper picks the right one.

export function getBestImage(
  images: SpotifyImage[],
  preferredSize: "small" | "medium" | "large" = "medium"
): string {
  if (!images || images.length === 0) return "/images/placeholder.png";
  if (images.length === 1) return images[0].url;

  const sorted = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));

  if (preferredSize === "large") return sorted[0].url;
  if (preferredSize === "small") return sorted[sorted.length - 1].url;
  // medium = closest to middle
  return sorted[Math.floor(sorted.length / 2)].url;
}

// ─── String Utilities ─────────────────────────────────────────────────────────

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

// ─── Genre Analytics Helpers ──────────────────────────────────────────────────

export function aggregateGenres(
  artistGenres: string[][]
): Array<{ genre: string; count: number; percentage: number }> {
  const genreMap = new Map<string, number>();

  for (const genres of artistGenres) {
    for (const genre of genres) {
      genreMap.set(genre, (genreMap.get(genre) ?? 0) + 1);
    }
  }

  const total = Array.from(genreMap.values()).reduce((a, b) => a + b, 0);

  return Array.from(genreMap.entries())
    .map(([genre, count]) => ({
      genre: capitalize(genre),
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

export function getHourLabel(hour: number): string {
  if (hour === 0) return "12am";
  if (hour === 12) return "12pm";
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Popularity Formatting ────────────────────────────────────────────────────

export function popularityToLabel(popularity: number): string {
  if (popularity >= 80) return "Very Popular";
  if (popularity >= 60) return "Popular";
  if (popularity >= 40) return "Moderate";
  if (popularity >= 20) return "Underground";
  return "Obscure";
}

// ─── Color Utilities ──────────────────────────────────────────────────────────

export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function withOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}
