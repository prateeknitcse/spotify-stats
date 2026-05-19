"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Music } from "lucide-react";
import { getBestImage, formatDuration, truncate, cn } from "@/lib/utils";
import type { SpotifyTrack } from "@/types";

interface TrackRowProps {
  track: SpotifyTrack;
  rank: number;
  index: number;
}

// ─── TrackRow ─────────────────────────────────────────────────────────────────
// Single track row: rank · album art · name + artists · album · duration · popularity

export function TrackRow({ track, rank, index }: TrackRowProps) {
  const albumArt = getBestImage(track.album.images, "small");
  const artists = track.artists.map((a) => a.name).join(", ");

  return (
    <motion.a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className={cn(
        "group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
        index !== 0 && "border-t border-border"
      )}
    >
      {/* Rank */}
      <span
        className={cn(
          "w-7 flex-shrink-0 text-center text-sm font-bold",
          rank <= 3 ? "text-primary" : "text-muted-foreground/40"
        )}
      >
        {rank}
      </span>

      {/* Album art */}
      <div className="relative h-11 w-11 flex-shrink-0">
        <Image
          src={albumArt}
          alt={track.album.name}
          fill
          sizes="44px"
          className="rounded-lg object-cover"
        />
      </div>

      {/* Track + artists */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {truncate(track.name, 40)}
          </p>
          {track.explicit && (
            <span className="flex-shrink-0 rounded bg-muted px-1 py-0.5 text-[9px] font-bold uppercase text-muted-foreground">
              E
            </span>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {truncate(artists, 40)}
        </p>
      </div>

      {/* Album name — hidden on mobile */}
      <p className="hidden w-32 flex-shrink-0 truncate text-xs text-muted-foreground/60 lg:block">
        {truncate(track.album.name, 22)}
      </p>

      {/* Popularity bar — hidden on small screens */}
      <div className="hidden w-24 flex-shrink-0 md:block">
        <div className="mb-1 flex justify-between">
          <span className="text-[10px] text-muted-foreground/50">Pop.</span>
          <span className="text-[10px] font-medium text-muted-foreground">
            {track.popularity}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${track.popularity}%` }}
            transition={{ duration: 0.6, delay: index * 0.03, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Duration */}
      <span className="flex-shrink-0 text-xs text-muted-foreground">
        {formatDuration(track.duration_ms)}
      </span>

      {/* External link */}
      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary" />
    </motion.a>
  );
}

// ─── TrackRowHeader ───────────────────────────────────────────────────────────
// Column headers for the track list table.

export function TrackRowHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
      <span className="w-7 text-center">#</span>
      <span className="w-11 flex-shrink-0" aria-hidden="true">
        <Music className="h-3.5 w-3.5" />
      </span>
      <span className="flex-1">Title</span>
      <span className="hidden w-32 lg:block">Album</span>
      <span className="hidden w-24 md:block">Popularity</span>
      <span>Time</span>
      <span className="w-3.5" aria-hidden="true" />
    </div>
  );
}
