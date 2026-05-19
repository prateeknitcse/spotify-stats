"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Users, Crown } from "lucide-react";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { ProfileHeaderSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatNumber, getBestImage } from "@/lib/utils";

// ─── ProfileHeader ────────────────────────────────────────────────────────────
// Displays the Spotify user's avatar, name, follower count, and plan badge.
// Sits at the top of the dashboard overview page.

export function ProfileHeader() {
  const { data: profile, isLoading, error, refetch } = useProfile();

  if (isLoading) return <ProfileHeaderSkeleton />;

  if (error || !profile) {
    return (
      <ErrorState
        compact
        message="Could not load your profile."
        onRetry={() => refetch()}
      />
    );
  }

  const avatarUrl = getBestImage(profile.images, "large");
  const isPremium = profile.product === "premium";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:gap-7"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="relative h-28 w-28 sm:h-36 sm:w-36">
          {avatarUrl && avatarUrl !== "/images/placeholder.png" ? (
            <Image
              src={avatarUrl}
              alt={profile.display_name ?? "User avatar"}
              fill
              sizes="(max-width: 640px) 112px, 144px"
              className="rounded-full object-cover ring-4 ring-primary/20"
              priority
            />
          ) : (
            // Fallback avatar with initials
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 ring-4 ring-primary/20">
              <span className="text-3xl font-bold text-primary">
                {(profile.display_name ?? "U").charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Online indicator */}
        <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background bg-primary pulse-glow" />
      </div>

      {/* Info */}
      <div className="flex flex-col items-center gap-2 sm:items-start sm:pb-1">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Spotify Profile
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {profile.display_name ?? "Spotify User"}
        </h1>

        {/* Badges row */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          {/* Followers */}
          <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <Users className="h-3 w-3" />
            {formatNumber(profile.followers.total)} followers
          </span>

          {/* Plan badge */}
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              isPremium
                ? "border border-yellow-500/30 bg-yellow-500/10 text-yellow-500"
                : "border border-border bg-muted text-muted-foreground"
            }`}
          >
            {isPremium && <Crown className="h-3 w-3" />}
            {isPremium ? "Premium" : "Free"}
          </span>

          {/* Country */}
          {profile.country && (
            <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {profile.country}
            </span>
          )}
        </div>

        {/* Spotify link */}
        <a
          href={profile.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground/60 transition-colors hover:text-primary"
        >
          <ExternalLink className="h-3 w-3" />
          Open in Spotify
        </a>
      </div>
    </motion.div>
  );
}
