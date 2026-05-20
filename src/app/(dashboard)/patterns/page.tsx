"use client";

import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";
import { HourlyChart } from "@/features/heatmap/components/HourlyChart";
import { DayOfWeekGrid } from "@/features/heatmap/components/DayOfWeekGrid";
import { PatternSummary } from "@/features/heatmap/components/PatternSummary";
import { useListeningPatterns } from "@/features/heatmap/hooks/useListeningPatterns";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ErrorState } from "@/components/shared/ErrorState";

export default function PatternsPage() {
  const { hourly, daily, insights, isLoading, error, refetch } = useListeningPatterns();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SectionHeader
          title="Listening Patterns"
          subtitle="When do you listen to music?"
          icon={BarChart2}
        />
      </motion.div>

      {error && (
        <ErrorState
          message="Could not load your recently played tracks."
          onRetry={refetch}
        />
      )}

      {/* Summary cards */}
      <PatternSummary insights={insights} isLoading={isLoading} />

      {/* Hour-of-day chart */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="mb-6 text-base font-semibold text-foreground">
          Hour of Day
        </h2>
        <HourlyChart
          data={hourly}
          isLoading={isLoading}
          peakHour={insights.peakHour?.hour}
        />
      </motion.section>

      {/* Day of week grid */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="mb-6 text-base font-semibold text-foreground">
          Day of Week
        </h2>
        <DayOfWeekGrid
          data={daily}
          isLoading={isLoading}
          peakDay={insights.peakDay?.day}
        />
      </motion.section>

      {/* Period breakdown */}
      {!isLoading && insights.totalTracks > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="mb-5 text-base font-semibold text-foreground">
            Time of Day Breakdown
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Night", emoji: "🌙", range: "12am–6am", count: insights.nightCount },
              { label: "Morning", emoji: "🌅", range: "6am–12pm", count: insights.morningCount },
              { label: "Afternoon", emoji: "☀️", range: "12pm–6pm", count: insights.afternoonCount },
              { label: "Evening", emoji: "🌆", range: "6pm–12am", count: insights.eveningCount },
            ].map((period) => {
              const pct = insights.totalTracks
                ? Math.round((period.count / insights.totalTracks) * 100)
                : 0;
              return (
                <div key={period.label} className="space-y-2 rounded-xl bg-muted/50 p-4 text-center">
                  <span className="text-2xl">{period.emoji}</span>
                  <div>
                    <p className="text-lg font-bold text-foreground">{pct}%</p>
                    <p className="text-sm font-medium text-foreground">{period.label}</p>
                    <p className="text-xs text-muted-foreground">{period.range}</p>
                    <p className="text-xs text-muted-foreground">{period.count} tracks</p>
                  </div>
                  {/* Mini bar */}
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}
    </div>
  );
}
