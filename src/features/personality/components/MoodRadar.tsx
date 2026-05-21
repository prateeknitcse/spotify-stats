"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import type { MoodScore } from "@/features/personality/hooks/usePersonality";

interface MoodRadarProps {
  moods: MoodScore[];
  isLoading: boolean;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold text-foreground">{d.payload.label}</p>
      <p className="text-xs text-muted-foreground">
        Score: <span className="font-bold text-primary">{d.value}</span>/100
      </p>
    </div>
  );
}

export function MoodRadar({ moods, isLoading }: MoodRadarProps) {
  if (isLoading) return <Skeleton className="mx-auto h-64 w-64 rounded-full" />;

  const data = moods.map((m) => ({
    label: `${m.emoji} ${m.label}`,
    score: m.score,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <Radar
            name="Mood"
            dataKey="score"
            stroke="#1DB954"
            fill="#1DB954"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
