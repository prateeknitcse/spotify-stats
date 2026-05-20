"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import type { GenreData } from "@/features/genres/hooks/useGenres";

function ActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="hsl(var(--foreground))"
        style={{ fontSize: 13, fontWeight: 600 }}>
        {payload.genre.length > 16 ? payload.genre.slice(0, 14) + "…" : payload.genre}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="hsl(var(--muted-foreground))"
        style={{ fontSize: 12 }}>
        {payload.count} artists
      </text>
      <text x={cx} y={cy + 28} textAnchor="middle" fill={fill}
        style={{ fontSize: 13, fontWeight: 700 }}>
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 12} outerRadius={outerRadius + 16}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as GenreData;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold text-foreground">{d.genre}</p>
      <p className="text-xs text-muted-foreground">
        {d.count} artists ·{" "}
        <span className="font-bold" style={{ color: d.color }}>{d.percentage}%</span>
      </p>
    </div>
  );
}

interface GenreDonutChartProps {
  genres: GenreData[];
  isLoading: boolean;
}

export function GenreDonutChart({ genres, isLoading }: GenreDonutChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-64 w-64 rounded-full" />
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-16 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  const top12 = genres.slice(0, 12);
  const otherCount = genres.slice(12).reduce((s, g) => s + g.count, 0);
  const otherPct = genres.slice(12).reduce((s, g) => s + g.percentage, 0);

  const chartData: GenreData[] = [
    ...top12,
    ...(otherCount > 0
      ? [{ genre: "Other", count: otherCount, percentage: otherPct, color: "hsl(var(--muted-foreground))" }]
      : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            dataKey="count"
            activeIndex={activeIndex}
            activeShape={<ActiveShape />}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            stroke="none"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {chartData.slice(0, 8).map((g) => (
          <div key={g.genre} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: g.color }} />
            <span className="text-xs text-muted-foreground">{g.genre}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
