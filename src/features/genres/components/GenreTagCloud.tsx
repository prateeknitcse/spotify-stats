"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import { cn } from "@/lib/utils";
import type { GenreData } from "@/features/genres/hooks/useGenres";

interface GenreTagCloudProps {
  genres: GenreData[];
  isLoading: boolean;
}

// ─── GenreTagCloud ────────────────────────────────────────────────────────────
// Tag cloud where font size and opacity scale with genre count.
// Top genre = largest + full opacity. Rarest = smallest + faded.

export function GenreTagCloud({ genres, isLoading }: GenreTagCloudProps) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
  key={i}
  style={{
    height: "28px",
    width: `${Math.random() * 60 + 48}px`,
  }}
>
  <Skeleton className="rounded-full w-full h-full" />
</div>
        ))}
      </div>
    );
  }

  if (!genres.length) return null;

  const maxCount = genres[0].count;
  const minCount = genres[genres.length - 1].count;
  const range = maxCount - minCount || 1;

  // Normalize count to a 0-1 scale for sizing
  const normalize = (count: number) => (count - minCount) / range;

  const getFontSize = (count: number) => {
    const n = normalize(count);
    // Scale from 11px (smallest) to 22px (largest)
    return Math.round(11 + n * 11);
  };

  const getOpacity = (count: number) => {
    const n = normalize(count);
    // Scale from 0.4 to 1.0
    return 0.4 + n * 0.6;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre, i) => (
        <motion.div
          key={genre.genre}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: i * 0.02 }}
        >
          <span
            className={cn(
              "inline-flex cursor-default items-center rounded-full border px-3 py-1",
              "font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
            )}
            style={{
              fontSize: getFontSize(genre.count),
              opacity: getOpacity(genre.count),
              borderColor: `${genre.color}40`,
              backgroundColor: `${genre.color}12`,
              color: genre.color,
            }}
            title={`${genre.count} artists · ${genre.percentage}%`}
          >
            {genre.genre}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
