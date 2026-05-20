"use client";

import { motion } from "framer-motion";
import { Clock, Calendar, Sunrise, Sunset, Moon, Sun } from "lucide-react";
import { StatCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { getHourLabel } from "@/lib/utils";
import type { PatternInsights } from "@/features/heatmap/hooks/useListeningPatterns";

interface PatternSummaryProps {
  insights: PatternInsights;
  isLoading: boolean;
}

// ─── PatternSummary ───────────────────────────────────────────────────────────
// Four summary cards: peak hour, peak day, period label, total tracks analysed.

const PERIOD_ICONS = {
  "Morning Listener":   Sunrise,
  "Afternoon Listener": Sun,
  "Evening Listener":   Sunset,
  "Night Owl":          Moon,
};

export function PatternSummary({ insights, isLoading }: PatternSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    );
  }

  const PeriodIcon = PERIOD_ICONS[insights.listeningPeriod as keyof typeof PERIOD_ICONS] ?? Clock;

  const peakHourDisplay = insights.peakHour
    ? getHourLabel(insights.peakHour.hour)
    : "—";

  const cards = [
    {
      icon: Clock,
      value: peakHourDisplay,
      label: "Peak hour",
      sub: insights.peakHour ? `${insights.peakHour.count} tracks` : "No data",
    },
    {
      icon: Calendar,
      value: insights.peakDay?.label ?? "—",
      label: "Busiest day",
      sub: insights.peakDay ? `${insights.peakDay.count} tracks` : "No data",
    },
    {
      icon: PeriodIcon,
      value: insights.listeningPeriod,
      label: "Listening style",
      sub: "Based on recent plays",
    },
    {
      icon: Clock,
      value: insights.totalTracks,
      label: "Tracks analysed",
      sub: "Recently played",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.07 }}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <card.icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight text-foreground">
              {card.value}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-xs text-muted-foreground/60">{card.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
