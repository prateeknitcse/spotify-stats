"use client";

import { useMemo } from "react";
import { useTopTracks } from "@/features/top-items/hooks/useTopTracks";
import { useTopArtists } from "@/features/top-items/hooks/useTopArtists";
import { useListeningPatterns } from "@/features/heatmap/hooks/useListeningPatterns";
import { aggregateGenres, capitalize } from "@/lib/utils";
import type { TimeRange } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MoodType = "euphoric" | "energetic" | "chill" | "melancholic" | "focused" | "romantic";

export interface MoodScore {
  mood: MoodType;
  label: string;
  emoji: string;
  score: number;       // 0-100
  color: string;
  description: string;
}

export interface PersonalityResult {
  // Core identity
  primaryMood: MoodScore;
  allMoods: MoodScore[];
  personalityType: string;
  personalityDescription: string;
  // Music stats
  topGenres: string[];
  topArtistNames: string[];
  topTrackName: string;
  topTrackArtist: string;
  // Listening style
  listeningPeriod: string;
  // Derived scores (0-100)
  mainstreamScore: number;
  diversityScore: number;
  // Meta
  isLoading: boolean;
  hasData: boolean;
}

// ─── Mood definitions ─────────────────────────────────────────────────────────

const MOOD_META: Record<MoodType, { label: string; emoji: string; color: string; description: string }> = {
  euphoric:    { label: "Euphoric",    emoji: "🎉", color: "#ffd43b", description: "High energy, celebratory music" },
  energetic:   { label: "Energetic",   emoji: "⚡", color: "#ff6b6b", description: "Fast-paced, high-intensity tracks" },
  chill:       { label: "Chill",       emoji: "😌", color: "#74c0fc", description: "Relaxed, laid-back vibes" },
  melancholic: { label: "Melancholic", emoji: "🌧️", color: "#b197fc", description: "Emotional, introspective music" },
  focused:     { label: "Focused",     emoji: "🎯", color: "#1DB954", description: "Steady beats, concentration music" },
  romantic:    { label: "Romantic",    emoji: "💖", color: "#f783ac", description: "Love songs and soulful melodies" },
};

// ─── Personality archetypes ────────────────────────────────────────────────────

function derivePersonalityType(
  topGenres: string[],
  mainstreamScore: number,
  diversityScore: number,
  listeningPeriod: string
): { type: string; description: string } {
  const genreStr = topGenres.join(" ").toLowerCase();

  if (genreStr.includes("hip hop") || genreStr.includes("rap"))
    return { type: "The Trendsetter", description: "You're plugged into culture. Hip-hop shapes your identity and you're always ahead of the curve." };
  if (genreStr.includes("indie") || genreStr.includes("alternative"))
    return { type: "The Indie Soul", description: "You curate your taste carefully. Authenticity matters more than charts." };
  if (genreStr.includes("electronic") || genreStr.includes("edm") || genreStr.includes("house"))
    return { type: "The Night Architect", description: "You live for the drop. Electronic textures and rhythmic precision define your sound." };
  if (genreStr.includes("classical") || genreStr.includes("jazz") || genreStr.includes("instrumental"))
    return { type: "The Intellectual", description: "Depth over surface. You appreciate musical complexity and timeless craft." };
  if (genreStr.includes("r&b") || genreStr.includes("soul") || genreStr.includes("neo soul"))
    return { type: "The Soulful Romantic", description: "Groove and emotion are your language. You feel music in your chest." };
  if (genreStr.includes("pop"))
    return { type: "The Chart Surfer", description: "You ride the cultural wave. Pop bangers and viral hits fuel your energy." };
  if (genreStr.includes("rock") || genreStr.includes("metal"))
    return { type: "The Rebel", description: "Raw energy and intensity. You want music that means something, and hits hard." };
  if (listeningPeriod === "Night Owl")
    return { type: "The Night Owl", description: "The quiet hours are yours. Late-night sessions where music hits different." };
  if (mainstreamScore < 40)
    return { type: "The Tastemaker", description: "You dig deep. Underground finds and obscure gems are your trophy case." };
  if (diversityScore > 70)
    return { type: "The Genre Nomad", description: "Boundaries don't exist for you. Your playlist is a world tour of sound." };

  return { type: "The All-Rounder", description: "Eclectic and open-minded. Your taste defies a single label — and that's a strength." };
}

// ─── Mood scoring from track metadata ─────────────────────────────────────────
// Since we don't have audio features, we infer mood from:
// - genre keywords
// - track popularity (mainstream = upbeat)
// - artist follower counts
// - listening time of day

function scoreMoods(
  genres: string[],
  avgPopularity: number,
  listeningPeriod: string,
  diversityScore: number
): MoodScore[] {
  const genreStr = genres.join(" ").toLowerCase();

  // Base scores derived from genre keywords
  let scores: Record<MoodType, number> = {
    euphoric:    0,
    energetic:   0,
    chill:       0,
    melancholic: 0,
    focused:     0,
    romantic:    0,
  };

  // Genre signals
  if (genreStr.match(/edm|dance|house|techno|club|party/)) { scores.euphoric += 30; scores.energetic += 25; }
  if (genreStr.match(/hip.hop|rap|trap|drill/))              { scores.energetic += 25; scores.euphoric += 15; }
  if (genreStr.match(/pop|k.pop/))                           { scores.euphoric += 20; scores.energetic += 10; }
  if (genreStr.match(/rock|metal|punk|hardcore/))            { scores.energetic += 35; }
  if (genreStr.match(/indie|alternative|lo.fi|bedroom/))     { scores.chill += 20; scores.melancholic += 15; }
  if (genreStr.match(/jazz|blues|soul|neo.soul/))            { scores.chill += 20; scores.romantic += 20; }
  if (genreStr.match(/classical|ambient|acoustic|folk/))     { scores.chill += 25; scores.focused += 20; scores.melancholic += 10; }
  if (genreStr.match(/r&b|rnb|slow jam/))                    { scores.romantic += 30; scores.chill += 15; }
  if (genreStr.match(/sad|emo|melanchol|depres/))            { scores.melancholic += 35; }
  if (genreStr.match(/study|focus|work|instrumental/))       { scores.focused += 35; }

  // Popularity modifier — mainstream pop = more upbeat
  if (avgPopularity > 70) { scores.euphoric += 15; scores.energetic += 10; }
  if (avgPopularity < 40) { scores.melancholic += 10; scores.focused += 10; }

  // Listening period modifier
  if (listeningPeriod === "Night Owl")          { scores.melancholic += 10; scores.chill += 10; }
  if (listeningPeriod === "Morning Listener")   { scores.energetic += 10; scores.focused += 10; }
  if (listeningPeriod === "Evening Listener")   { scores.romantic += 10; scores.chill += 5; }
  if (listeningPeriod === "Afternoon Listener") { scores.euphoric += 5; }

  // Normalize to 0-100
  const maxRaw = Math.max(...Object.values(scores), 1);
  const normalized = Object.fromEntries(
    Object.entries(scores).map(([k, v]) => [k, Math.min(100, Math.round((v / maxRaw) * 100))])
  ) as Record<MoodType, number>;

  // Guarantee at least some score on every mood
  (Object.keys(normalized) as MoodType[]).forEach((k) => {
    normalized[k] = Math.max(normalized[k], 10);
  });

  return (Object.entries(normalized) as [MoodType, number][])
    .map(([mood, score]) => ({ mood, score, ...MOOD_META[mood] }))
    .sort((a, b) => b.score - a.score);
}

// ─── usePersonality ───────────────────────────────────────────────────────────

export function usePersonality(timeRange: TimeRange): PersonalityResult {
  const { data: tracks, isLoading: tLoading } = useTopTracks(timeRange);
  const { data: artists, isLoading: aLoading } = useTopArtists(timeRange);
  const { insights, isLoading: pLoading } = useListeningPatterns();

  const isLoading = tLoading || aLoading || pLoading;

  return useMemo<PersonalityResult>(() => {
    const noData: PersonalityResult = {
      primaryMood: { mood: "chill", label: "Chill", emoji: "😌", score: 0, color: "#74c0fc", description: "" },
      allMoods: [],
      personalityType: "—",
      personalityDescription: "Connect Spotify and explore your music personality.",
      topGenres: [],
      topArtistNames: [],
      topTrackName: "—",
      topTrackArtist: "—",
      listeningPeriod: insights.listeningPeriod,
      mainstreamScore: 0,
      diversityScore: 0,
      isLoading,
      hasData: false,
    };

    if (isLoading || !tracks?.items.length || !artists?.items.length) {
      return { ...noData, isLoading };
    }

    // Derived values
    const topGenres = aggregateGenres(artists.items.map((a) => a.genres))
      .slice(0, 5)
      .map((g) => g.genre);

    const topArtistNames = artists.items.slice(0, 5).map((a) => a.name);
    const topTrack = tracks.items[0];
    const topTrackName = topTrack?.name ?? "—";
    const topTrackArtist = topTrack?.artists[0]?.name ?? "—";

    const avgPopularity = Math.round(
      tracks.items.reduce((s, t) => s + t.popularity, 0) / tracks.items.length
    );

    const allGenres = aggregateGenres(artists.items.map((a) => a.genres));
    const diversityScore = Math.min(100, Math.round((allGenres.length / 20) * 100));
    const mainstreamScore = avgPopularity;

    const allMoods = scoreMoods(
      topGenres,
      avgPopularity,
      insights.listeningPeriod,
      diversityScore
    );
    const primaryMood = allMoods[0];

    const { type: personalityType, description: personalityDescription } =
      derivePersonalityType(topGenres, mainstreamScore, diversityScore, insights.listeningPeriod);

    return {
      primaryMood,
      allMoods,
      personalityType,
      personalityDescription,
      topGenres,
      topArtistNames,
      topTrackName,
      topTrackArtist,
      listeningPeriod: insights.listeningPeriod,
      mainstreamScore,
      diversityScore,
      isLoading: false,
      hasData: true,
    };
  }, [tracks, artists, insights, isLoading]);
}
