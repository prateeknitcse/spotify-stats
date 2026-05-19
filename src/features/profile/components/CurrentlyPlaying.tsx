"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, ExternalLink } from "lucide-react";
import { useCurrentlyPlaying } from "@/features/profile/hooks/useCurrentlyPlaying";
import { CurrentlyPlayingSkeleton } from "@/components/shared/LoadingSkeleton";
import { formatDuration, getBestImage, truncate } from "@/lib/utils";

// ─── CurrentlyPlaying ─────────────────────────────────────────────────────────
// Live widget showing what the user is listening to right now.
// Polls every 30s. Shows animated bars when playing, hidden when nothing plays.

export function CurrentlyPlaying() {
  const { data, isLoading } = useCurrentlyPlaying();

  if (isLoading) return <CurrentlyPlayingSkeleton />;

  // Nothing playing — render nothing (don't show an empty card)
  if (!data || !data.is_playing || !data.item) return null;

  const track = data.item;
  const albumArt = getBestImage(track.album.images, "small");
  const artistNames = track.artists.map((a) => a.name).join(", ");
  const progressPercent = data.progress_ms && track.duration_ms
    ? (data.progress_ms / track.duration_ms) * 100
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        key={track.id}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4"
      >
        {/* Album art */}
        <div className="relative h-14 w-14 flex-shrink-0">
          <Image
            src={albumArt}
            alt={`${track.album.name} cover`}
            fill
            sizes="56px"
            className="rounded-xl object-cover"
          />
        </div>

        {/* Track info */}
        <div className="min-w-0 flex-1">
          {/* Now playing label with animated bars */}
          <div className="mb-1 flex items-center gap-2">
            <SoundBars />
            <span className="text-xs font-medium text-primary">
              Now Playing
            </span>
          </div>

          <p className="truncate font-semibold text-foreground">
            {truncate(track.name, 40)}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {truncate(artistNames, 40)}
          </p>

          {/* Progress bar */}
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-primary/10">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Duration + link */}
        <div className="flex flex-shrink-0 flex-col items-end gap-2">
          <a
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="Open in Spotify"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <span className="text-xs text-muted-foreground">
            {data.progress_ms ? formatDuration(data.progress_ms) : "0:00"}
            {" / "}
            {formatDuration(track.duration_ms)}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Animated Sound Bars ──────────────────────────────────────────────────────
// Classic "now playing" animation — 3 bars bouncing at different speeds.

function SoundBars() {
  return (
    <div
      className="flex items-end gap-[2px]"
      aria-label="Currently playing"
      role="img"
    >
      {[0.4, 0.7, 0.5].map((duration, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-primary"
          animate={{ height: ["4px", "12px", "6px", "10px", "4px"] }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
          style={{ height: "4px" }}
        />
      ))}
    </div>
  );
}
