"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { spotifyClient } from "@/lib/spotify/client";
import { QUERY_KEYS } from "@/lib/constants";
import { getHourLabel, DAY_LABELS } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HourlyData {
  hour: number;
  label: string;        // "12am", "3pm" etc.
  count: number;
  intensity: number;    // 0–1 normalized
}

export interface DayData {
  day: number;          // 0 = Sunday
  label: string;        // "Sun", "Mon" etc.
  count: number;
  intensity: number;
}

export interface PatternInsights {
  peakHour: HourlyData | null;
  peakDay: DayData | null;
  morningCount: number;   // 6–11
  afternoonCount: number; // 12–17
  eveningCount: number;   // 18–23
  nightCount: number;     // 0–5
  totalTracks: number;
  listeningPeriod: string;
}

export interface ListeningPatterns {
  hourly: HourlyData[];
  daily: DayData[];
  insights: PatternInsights;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// ─── useListeningPatterns ─────────────────────────────────────────────────────
// Fetches the 50 most recently played tracks and derives:
//   - Hour-of-day distribution (0–23)
//   - Day-of-week distribution (0–6, Sunday=0)
//   - Listening period label (morning / afternoon / evening / night)
// All analysis is client-side via useMemo — no extra API calls.

export function useListeningPatterns(): ListeningPatterns {
  const { accessToken } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.recentlyPlayed,
    queryFn: () => spotifyClient.getRecentlyPlayed(accessToken!, 50),
    enabled: !!accessToken,
    staleTime: 2 * 60 * 1000, // 2 minutes — recent plays change fast
  });

  const { hourly, daily, insights } = useMemo(() => {
    if (!data?.items.length) {
      return { hourly: [], daily: [], insights: emptyInsights() };
    }

    // ── Aggregate by hour ──────────────────────────────────────────────────
    const hourCounts = new Array(24).fill(0) as number[];
    const dayCounts  = new Array(7).fill(0)  as number[];

    for (const item of data.items) {
      const date = new Date(item.played_at);
      hourCounts[date.getHours()]++;
      dayCounts[date.getDay()]++;
    }

    const maxHour = Math.max(...hourCounts, 1);
    const maxDay  = Math.max(...dayCounts, 1);

    const hourly: HourlyData[] = hourCounts.map((count, hour) => ({
      hour,
      label: getHourLabel(hour),
      count,
      intensity: count / maxHour,
    }));

    const daily: DayData[] = dayCounts.map((count, day) => ({
      day,
      label: DAY_LABELS[day],
      count,
      intensity: count / maxDay,
    }));

    // ── Insights ───────────────────────────────────────────────────────────
    const peakHour = [...hourly].sort((a, b) => b.count - a.count)[0] ?? null;
    const peakDay  = [...daily].sort((a, b) => b.count - a.count)[0] ?? null;

    const morningCount   = hourCounts.slice(6, 12).reduce((a, b) => a + b, 0);
    const afternoonCount = hourCounts.slice(12, 18).reduce((a, b) => a + b, 0);
    const eveningCount   = hourCounts.slice(18, 24).reduce((a, b) => a + b, 0);
    const nightCount     = hourCounts.slice(0, 6).reduce((a, b) => a + b, 0);

    // Derive a human-readable period label
    const maxPeriod = Math.max(morningCount, afternoonCount, eveningCount, nightCount);
    const listeningPeriod =
      maxPeriod === morningCount   ? "Morning Listener" :
      maxPeriod === afternoonCount ? "Afternoon Listener" :
      maxPeriod === eveningCount   ? "Evening Listener" :
                                     "Night Owl";

    return {
      hourly,
      daily,
      insights: {
        peakHour,
        peakDay,
        morningCount,
        afternoonCount,
        eveningCount,
        nightCount,
        totalTracks: data.items.length,
        listeningPeriod,
      },
    };
  }, [data]);

  return {
    hourly,
    daily,
    insights,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

function emptyInsights(): PatternInsights {
  return {
    peakHour: null,
    peakDay: null,
    morningCount: 0,
    afternoonCount: 0,
    eveningCount: 0,
    nightCount: 0,
    totalTracks: 0,
    listeningPeriod: "—",
  };
}
