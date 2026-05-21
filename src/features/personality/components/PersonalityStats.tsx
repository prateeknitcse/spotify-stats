"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/shared/LoadingSkeleton";

interface PersonalityStatsProps {
  mainstreamScore: number;
  diversityScore: number;
  listeningPeriod: string;
  isLoading: boolean;
}

export function PersonalityStats({
  mainstreamScore,
  diversityScore,
  listeningPeriod,
  isLoading,
}: PersonalityStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Mainstream Score",
      value: mainstreamScore,
      suffix: "/100",
      description: mainstreamScore > 60 ? "You enjoy popular music" : "You prefer underground gems",
      color: "#1DB954",
      showBar: true,
    },
    {
      label: "Genre Diversity",
      value: diversityScore,
      suffix: "/100",
      description: diversityScore > 60 ? "Wide-ranging taste" : "Focused music identity",
      color: "#74c0fc",
      showBar: true,
    },
    {
      label: "Listening Style",
      value: listeningPeriod,
      suffix: "",
      description: "Your peak listening period",
      color: "#b197fc",
      showBar: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {stat.value}
              {stat.suffix && (
                <span className="ml-0.5 text-sm font-normal text-muted-foreground">
                  {stat.suffix}
                </span>
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
          </div>
          {stat.showBar && typeof stat.value === "number" && (
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: stat.color }}
                initial={{ width: 0 }}
                animate={{ width: `${stat.value}%` }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
