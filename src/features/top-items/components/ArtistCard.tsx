"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Users } from "lucide-react";
import { getBestImage, formatNumber, truncate, cn } from "@/lib/utils";
import type { SpotifyArtist } from "@/types";

interface ArtistCardProps {
  artist: SpotifyArtist;
  rank: number;
  index: number; // for stagger animation delay
  view: "grid" | "list";
}

// ─── ArtistCard ───────────────────────────────────────────────────────────────
// Supports two views:
//   grid — square card with image, name, genres (default on desktop)
//   list — horizontal row with rank, image, name, genres, popularity

export function ArtistCard({ artist, rank, index, view }: ArtistCardProps) {
  const image = getBestImage(artist.images, view === "grid" ? "medium" : "small");

  if (view === "list") {
    return (
      <motion.a
        href={artist.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        className="group flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-3 transition-all hover:border-primary/30 hover:bg-card/80"
      >
        {/* Rank */}
        <span
          className={cn(
            "w-7 flex-shrink-0 text-center text-sm font-bold",
            rank <= 3 ? "text-primary" : "text-muted-foreground/50"
          )}
        >
          {rank}
        </span>

        {/* Avatar */}
        <div className="relative h-12 w-12 flex-shrink-0">
          <Image
            src={image}
            alt={artist.name}
            fill
            sizes="48px"
            className="rounded-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
            {artist.name}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {artist.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Followers */}
        <div className="hidden flex-shrink-0 items-center gap-1.5 sm:flex">
          <Users className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="text-xs text-muted-foreground">
            {formatNumber(artist.followers.total)}
          </span>
        </div>

        {/* Popularity bar */}
        <div className="hidden w-20 flex-shrink-0 md:block">
          <div className="mb-1 flex justify-between">
            <span className="text-[10px] text-muted-foreground/60">Popularity</span>
            <span className="text-[10px] font-medium text-muted-foreground">
              {artist.popularity}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${artist.popularity}%` }}
              transition={{ duration: 0.6, delay: index * 0.04, ease: "easeOut" }}
            />
          </div>
        </div>

        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
      </motion.a>
    );
  }

  // Grid view
  return (
    <motion.a
      href={artist.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card p-4 text-center transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Rank badge */}
      <span
        className={cn(
          "absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
          rank <= 3
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {rank}
      </span>

      {/* Artist image */}
      <div className="relative mt-2 h-20 w-20">
        <Image
          src={image}
          alt={artist.name}
          fill
          sizes="80px"
          className="rounded-full object-cover ring-2 ring-border transition-all group-hover:ring-primary/40"
        />
      </div>

      {/* Name */}
      <div className="w-full">
        <p className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
          {truncate(artist.name, 18)}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatNumber(artist.followers.total)} followers
        </p>
      </div>

      {/* Top genre */}
      {artist.genres[0] && (
        <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
          {truncate(artist.genres[0], 20)}
        </span>
      )}

      {/* Popularity bar */}
      <div className="w-full">
        <div className="h-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary/60"
            initial={{ width: 0 }}
            animate={{ width: `${artist.popularity}%` }}
            transition={{ duration: 0.7, delay: index * 0.04, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.a>
  );
}
