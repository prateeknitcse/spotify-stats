"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import type { GenreData } from "@/features/genres/hooks/useGenres";

interface GenreRankListProps {
  genres: GenreData[];
  isLoading: boolean;
  limit?: number;
}

// ─── GenreRankList ────────────────────────────────────────────────────────────
// Ranked list of genres with animated fill bars and artist count.
// Defaults to top 15.

export function GenreRankList({
  genres,
  isLoading,
  limit = 15,
}: GenreRankListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3.5 w-10" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  const top = genres.slice(0, limit);
  // Normalise bar widths to the top genre (not to 100 total)
  const maxCount = top[0]?.count ?? 1;

  return (
    <div className="space-y-3">
      {top.map((genre, i) => (
        <motion.div
          key={genre.genre}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
        >
          {/* Label row */}
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="w-5 flex-shrink-0 text-xs font-bold text-muted-foreground/50">
                {i + 1}
              </span>
              <span
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ backgroundColor: genre.color }}
              />
              <span className="truncate text-sm font-medium text-foreground">
                {genre.genre}
              </span>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2 text-xs text-muted-foreground">
              <span>{genre.count} artist{genre.count !== 1 ? "s" : ""}</span>
              <span
                className="font-bold"
                style={{ color: genre.color }}
              >
                {genre.percentage}%
              </span>
            </div>
          </div>

          {/* Animated bar */}
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: genre.color }}
              initial={{ width: 0 }}
              animate={{
                width: `${(genre.count / maxCount) * 100}%`,
              }}
              transition={{
                duration: 0.7,
                delay: i * 0.04,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
