"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import type { MoodScore } from "@/features/personality/hooks/usePersonality";

interface MoodBreakdownProps {
  moods: MoodScore[];
  isLoading: boolean;
}

export function MoodBreakdown({ moods, isLoading }: MoodBreakdownProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {moods.map((mood, i) => (
        <motion.div
          key={mood.mood}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          className="space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">{mood.emoji}</span>
              <span className="text-sm font-medium text-foreground">{mood.label}</span>
              {i === 0 && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Primary
                </span>
              )}
            </div>
            <span className="text-sm font-bold" style={{ color: mood.color }}>
              {mood.score}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: mood.color }}
              initial={{ width: 0 }}
              animate={{ width: `${mood.score}%` }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{mood.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
