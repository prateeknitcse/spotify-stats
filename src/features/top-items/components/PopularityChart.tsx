"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import { truncate } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";

interface PopularityChartProps {
  data: { name: string; popularity: number }[];
  isLoading?: boolean;
  label?: string;
}

// ─── CustomTooltip ────────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { name: string } }[];
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold text-foreground">
        {payload[0].payload.name}
      </p>
      <p className="text-xs text-muted-foreground">
        Popularity:{" "}
        <span className="font-bold text-primary">{payload[0].value}</span>
        /100
      </p>
    </div>
  );
}

// ─── PopularityChart ──────────────────────────────────────────────────────────
// Horizontal bar chart showing the top 10 artists or tracks by popularity score.
// Uses Recharts with a custom tooltip and Spotify green color scale.

export function PopularityChart({
  data,
  isLoading,
  label = "Items",
}: PopularityChartProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-[280px] w-full rounded-2xl" />
      </div>
    );
  }

  const top10 = data.slice(0, 10).map((item) => ({
    ...item,
    name: truncate(item.name, 16),
  }));

  // Color gradient: brighter for more popular
  const getColor = (popularity: number) => {
    if (popularity >= 80) return CHART_COLORS.primary;
    if (popularity >= 60) return CHART_COLORS.secondary;
    if (popularity >= 40) return CHART_COLORS.teal;
    return CHART_COLORS.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      <p className="text-sm font-medium text-muted-foreground">
        Top 10 {label} by Popularity Score
      </p>

      <div className="rounded-2xl border border-border bg-card p-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={top10}
            layout="vertical"
            margin={{ top: 0, right: 16, bottom: 0, left: 8 }}
            barSize={14}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "hsl(var(--muted))", radius: 6 }}
            />
            <Bar dataKey="popularity" radius={[0, 6, 6, 0]}>
              {top10.map((entry, i) => (
                <Cell key={i} fill={getColor(entry.popularity)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
