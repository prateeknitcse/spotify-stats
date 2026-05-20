"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import { withOpacity } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";
import type { HourlyData } from "@/features/heatmap/hooks/useListeningPatterns";

interface HourlyChartProps {
  data: HourlyData[];
  isLoading: boolean;
  peakHour?: number | null;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as HourlyData;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold text-foreground">{d.label}</p>
      <p className="text-xs text-muted-foreground">
        <span className="font-bold text-primary">{d.count}</span> tracks played
      </p>
    </div>
  );
}

// ─── HourlyChart ──────────────────────────────────────────────────────────────
// 24-bar chart showing listening distribution across hours of the day.
// Peak hour bar is highlighted in Spotify green, others scale with intensity.

export function HourlyChart({ data, isLoading, peakHour }: HourlyChartProps) {
  if (isLoading) {
    return <Skeleton className="h-56 w-full rounded-2xl" />;
  }

  const getBarColor = (entry: HourlyData) => {
    if (entry.hour === peakHour) return CHART_COLORS.primary;
    return withOpacity(CHART_COLORS.primary, 0.2 + entry.intensity * 0.55);
  };

  // Period background reference areas labels
  const periods = [
    { label: "Night", startHour: 0 },
    { label: "Morning", startHour: 6 },
    { label: "Afternoon", startHour: 12 },
    { label: "Evening", startHour: 18 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      {/* Period labels */}
      <div className="grid grid-cols-4 text-center">
        {periods.map((p) => (
          <span key={p.label} className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
            {p.label}
          </span>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -28 }} barSize={8} barCategoryGap="20%">
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", radius: 4 }} />

            {/* Period dividers */}
            {[6, 12, 18].map((h) => (
              <ReferenceLine key={h} x={data[h]?.label} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            ))}

            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Hour of day · Based on last 50 played tracks
      </p>
    </motion.div>
  );
}
