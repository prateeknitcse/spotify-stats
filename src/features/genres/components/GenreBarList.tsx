"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import type { GenreData } from "@/features/genres/hooks/useGenres";

interface GenreBarListProps {
  genres: GenreData[];
  isLoading: boolean;
  limit?: number;
}

// ─── GenreBarList ─────────────────────────────────────────────────────────────
// Animated horizontal bar list ranked by count.
// Each bar animates in with a staggered delay.

export function GenreBarList({ genres, isLoading, limit = 20 }: GenreBarListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" style={{ width: `${70 - i * 5}%` }} />
          </div>
        ))}
      </div>
    );
  }

  const topGenres = genres.slice(0, limit);
  const maxCount = topGenres[0]?.count ?? 1;

  return (
    <div className="space-y-3">
      {topGenres.map((genre, i) => (
        <motion.div
          key={genre.genre}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.035 }}
          className="space-y-1.5"
        >
          {/* Label row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex-shrink-0 text-xs font-bold text-muted-foreground/50 w-5 text-right">
                {i + 1}
              </span>
              <div
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ backgroundColor: genre.color }}
              />
              <span className="truncate text-sm font-medium text-foreground">
                {genre.genre}
              </span>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {genre.count} {genre.count === 1 ? "artist" : "artists"}
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: genre.color }}
              >
                {genre.percentage}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="ml-7 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: genre.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(genre.count / maxCount) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.035, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
