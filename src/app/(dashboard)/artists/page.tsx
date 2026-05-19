"use client";

import { motion } from "framer-motion";
import { Mic2 } from "lucide-react";
import { ArtistGrid } from "@/features/top-items/components/ArtistGrid";
import { PopularityChart } from "@/features/top-items/components/PopularityChart";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useTopArtists } from "@/features/top-items/hooks/useTopArtists";
import { useAppStore } from "@/stores/useAppStore";
import { TIME_RANGE_OPTIONS } from "@/lib/constants";

// ─── Top Artists Page ─────────────────────────────────────────────────────────

export default function ArtistsPage() {
  const { selectedTimeRange } = useAppStore();
  const { data, isLoading } = useTopArtists(selectedTimeRange);

  const timeLabel = TIME_RANGE_OPTIONS.find(
    (o) => o.value === selectedTimeRange
  )?.description;

  const chartData =
    data?.items.map((a) => ({
      name: a.name,
      popularity: a.popularity,
    })) ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SectionHeader
          title="Top Artists"
          subtitle={timeLabel}
          icon={Mic2}
        />
      </motion.div>

      {/* Popularity chart */}
      <PopularityChart
        data={chartData}
        isLoading={isLoading}
        label="Artists"
      />

      {/* Full artist grid / list */}
      <ArtistGrid />
    </div>
  );
}
