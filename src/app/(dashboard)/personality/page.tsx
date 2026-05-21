"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Share2 } from "lucide-react";
import { usePersonality } from "@/features/personality/hooks/usePersonality";
import { MoodRadar } from "@/features/personality/components/MoodRadar";
import { MoodBreakdown } from "@/features/personality/components/MoodBreakdown";
import { PersonalityStats } from "@/features/personality/components/PersonalityStats";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import { useAppStore } from "@/stores/useAppStore";

export default function PersonalityPage() {
  const { selectedTimeRange } = useAppStore();
  const personality = usePersonality(selectedTimeRange);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <SectionHeader
          title="Music Personality"
          subtitle="Your listening identity, decoded"
          icon={Sparkles}
        />
        <Link
          href="/dashboard/card"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
        >
          <Share2 className="h-4 w-4" />
          Share Card
        </Link>
      </motion.div>

      {/* Personality type hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center"
      >
        {/* Decorative glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative z-10 space-y-3">
          {personality.isLoading ? (
            <>
              <Skeleton className="mx-auto h-8 w-8 rounded-full" />
              <Skeleton className="mx-auto h-8 w-64" />
              <Skeleton className="mx-auto h-4 w-80" />
            </>
          ) : (
            <>
              <div className="text-4xl">{personality.primaryMood.emoji}</div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {personality.personalityType}
              </h2>
              <p className="mx-auto max-w-md text-base text-muted-foreground">
                {personality.personalityDescription}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {personality.topGenres.slice(0, 4).map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Stats row */}
      <PersonalityStats
        mainstreamScore={personality.mainstreamScore}
        diversityScore={personality.diversityScore}
        listeningPeriod={personality.listeningPeriod}
        isLoading={personality.isLoading}
      />

      {/* Radar + breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="mb-4 text-base font-semibold">Mood Profile</h2>
          <MoodRadar moods={personality.allMoods} isLoading={personality.isLoading} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="mb-4 text-base font-semibold">Mood Breakdown</h2>
          <MoodBreakdown moods={personality.allMoods} isLoading={personality.isLoading} />
        </motion.div>
      </div>

      {/* Top artists + tracks summary */}
      {!personality.isLoading && personality.hasData && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Defining Artists
            </p>
            <ul className="space-y-2">
              {personality.topArtistNames.map((name, i) => (
                <li key={name} className="flex items-center gap-3">
                  <span className="w-5 text-right text-xs font-bold text-muted-foreground/50">{i + 1}</span>
                  <span className="text-sm font-medium text-foreground">{name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Anthem Track
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-foreground">{personality.topTrackName}</p>
              <p className="text-sm text-muted-foreground">{personality.topTrackArtist}</p>
              <p className="mt-2 text-xs text-muted-foreground/60">
                Your most-listened track right now
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
