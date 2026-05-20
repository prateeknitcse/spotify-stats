"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import { withOpacity } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";
import type { DayData } from "@/features/heatmap/hooks/useListeningPatterns";

interface DayOfWeekGridProps {
  data: DayData[];
  isLoading: boolean;
  peakDay?: number | null;
}

// ─── DayOfWeekGrid ────────────────────────────────────────────────────────────
// 7-cell grid showing listening activity per day of the week.
// Cell size + color intensity scales with track count.

export function DayOfWeekGrid({ data, isLoading, peakDay }: DayOfWeekGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-3"
    >
      <div className="grid grid-cols-7 gap-2">
        {data.map((day, i) => {
          const isPeak = day.day === peakDay;
          const bgColor = isPeak
            ? CHART_COLORS.primary
            : withOpacity(CHART_COLORS.primary, 0.08 + day.intensity * 0.55);
          const textColor = isPeak ? "#000" : day.intensity > 0.5
            ? "hsl(var(--foreground))"
            : "hsl(var(--muted-foreground))";

          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="group relative flex aspect-square flex-col items-center justify-center rounded-xl border border-border transition-all hover:scale-105"
              style={{ backgroundColor: bgColor }}
              title={`${day.label}: ${day.count} tracks`}
            >
              <span
                className="text-xs font-bold"
                style={{ color: textColor }}
              >
                {day.label}
              </span>
              <span
                className="mt-0.5 text-[11px] font-semibold tabular-nums"
                style={{ color: textColor, opacity: 0.85 }}
              >
                {day.count}
              </span>

              {/* Peak crown indicator */}
              {isPeak && (
                <span className="absolute -top-2 text-xs" aria-label="Peak day">
                  👑
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Day of week · Tracks played per day
      </p>
    </motion.div>
  );
}
