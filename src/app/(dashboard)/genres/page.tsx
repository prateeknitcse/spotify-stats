"use client";

import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { GenreDonutChart } from "@/features/genres/components/GenreDonutChart";
import { GenreBarList } from "@/features/genres/components/GenreBarList";
import { GenreTagCloud } from "@/features/genres/components/GenreTagCloud";
import { useGenres } from "@/features/genres/hooks/useGenres";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { useAppStore } from "@/stores/useAppStore";
import { TIME_RANGE_OPTIONS } from "@/lib/constants";

export default function GenresPage() {
  const { selectedTimeRange } = useAppStore();
  const { genres, isLoading, error, refetch, totalArtists } = useGenres(selectedTimeRange);

  const timeLabel = TIME_RANGE_OPTIONS.find(
    (o) => o.value === selectedTimeRange
  )?.description;

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SectionHeader
          title="Genre Analytics"
          subtitle={timeLabel}
          icon={Tag}
        />
      </motion.div>

      {error && (
        <ErrorState
          message="Could not load genre data."
          onRetry={refetch}
        />
      )}

      {/* Summary pill */}
      {!isLoading && genres.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2"
        >
          {[
            { value: genres.length, label: "unique genres" },
            { value: totalArtists, label: "artists analysed" },
            { value: genres[0]?.genre ?? "—", label: "top genre" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5"
            >
              <span className="text-sm font-bold text-primary">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Donut chart + bar list — side by side on desktop */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Donut chart */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="mb-6 text-base font-semibold text-foreground">
            Distribution
          </h2>
          <GenreDonutChart genres={genres} isLoading={isLoading} />
        </motion.section>

        {/* Top genres bar list */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="mb-6 text-base font-semibold text-foreground">
            Top Genres
          </h2>
          <GenreBarList genres={genres} isLoading={isLoading} limit={15} />
        </motion.section>
      </div>

      {/* Tag cloud — full width */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="mb-6 text-base font-semibold text-foreground">
          All Genres
          {!isLoading && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({genres.length} total)
            </span>
          )}
        </h2>
        <GenreTagCloud genres={genres} isLoading={isLoading} />
      </motion.section>
    </div>
  );
}
