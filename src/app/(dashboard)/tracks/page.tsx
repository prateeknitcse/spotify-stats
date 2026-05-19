"use client";

import { motion } from "framer-motion";
import { Music } from "lucide-react";
import { TrackList } from "@/features/top-items/components/TrackList";
import { PopularityChart } from "@/features/top-items/components/PopularityChart";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useTopTracks } from "@/features/top-items/hooks/useTopTracks";
import { useAppStore } from "@/stores/useAppStore";
import { TIME_RANGE_OPTIONS } from "@/lib/constants";
import { formatDuration } from "@/lib/utils";

// ─── Top Tracks Page ──────────────────────────────────────────────────────────

export default function TracksPage() {
  const { selectedTimeRange } = useAppStore();
  const { data, isLoading } = useTopTracks(selectedTimeRange);

  const timeLabel = TIME_RANGE_OPTIONS.find(
    (o) => o.value === selectedTimeRange
  )?.description;

  const chartData =
    data?.items.map((t) => ({
      name: t.name,
      popularity: t.popularity,
    })) ?? [];

  // Compute total listening time
  const totalMs =
    data?.items.reduce((sum, t) => sum + t.duration_ms, 0) ?? 0;

  const explicitCount =
    data?.items.filter((t) => t.explicit).length ?? 0;

  const avgPopularity = data?.items.length
    ? Math.round(
        data.items.reduce((s, t) => s + t.popularity, 0) / data.items.length
      )
    : 0;

  const quickStats = [
    { label: "Total duration", value: formatDuration(totalMs) },
    { label: "Avg popularity", value: `${avgPopularity}/100` },
    { label: "Explicit tracks", value: `${explicitCount}` },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SectionHeader
          title="Top Tracks"
          subtitle={timeLabel}
          icon={Music}
        />
      </motion.div>

      {/* Quick stat pills */}
      {!isLoading && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2"
        >
          {quickStats.map((s) => (
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

      {/* Popularity chart */}
      <PopularityChart
        data={chartData}
        isLoading={isLoading}
        label="Tracks"
      />

      {/* Full track list */}
      <TrackList />
    </div>
  );
}
