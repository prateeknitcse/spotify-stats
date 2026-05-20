# Feature: 03 — User Profile Dashboard

**Date:** 2026-19  
**Module:** 03 of 10  
**Status:** ✅ Complete

---

## Goal

Build the main dashboard overview: user profile display, live currently-playing widget, stats overview cards, and preview lists for top artists and tracks — all with skeleton loading states and error handling.

---

## What We Built

| File | Purpose |
|---|---|
| `features/profile/hooks/useProfile.ts` | TanStack Query hook — fetches Spotify user profile |
| `features/profile/hooks/useCurrentlyPlaying.ts` | Polling hook — refreshes every 30s |
| `features/profile/components/ProfileHeader.tsx` | Avatar, name, followers, plan badge |
| `features/profile/components/CurrentlyPlaying.tsx` | Live widget with animated sound bars + progress |
| `features/profile/components/StatsOverview.tsx` | 4 metric cards derived from top items queries |
| `features/profile/components/QuickTopItems.tsx` | Top 6 artists grid + top 5 tracks list |
| `components/shared/LoadingSkeleton.tsx` | Skeleton presets for every component shape |
| `components/shared/ErrorState.tsx` | ErrorState + EmptyState reusable components |
| `components/shared/StatCard.tsx` | Reusable metric card with click navigation |
| `components/shared/SectionHeader.tsx` | Consistent section titles with icon + action slot |
| `app/(dashboard)/dashboard/page.tsx` | Full dashboard page — pure composition |
| `components/layout/Topbar.tsx` | Updated — real page titles + responsive time labels |

---

## Architecture Decisions

### Skeleton-first component design
Every component renders a skeleton that exactly matches the real layout's dimensions. This prevents layout shift (CLS) when data loads — the page doesn't jump. Each skeleton is a named export from `LoadingSkeleton.tsx` — discoverable and reusable.

### StatsOverview derives data from existing queries
Rather than making a new API call for stats, `StatsOverview` reuses the `topArtists` and `topTracks` queries (already in TanStack Query cache). `aggregateGenres()` computes unique genre count client-side. Zero extra API calls.

### CurrentlyPlaying polls on a 30s interval
`refetchInterval: 30_000` in TanStack Query handles polling cleanly. No `setInterval` anywhere. The component returns `null` when nothing is playing — no empty card shown. This is better UX than showing "Nothing playing" every time the user isn't listening.

### QuickTopItems as separate named exports
`QuickTopArtists` and `QuickTopTracks` are separate components rather than one with a prop. Easier to move independently, easier to test, and the dashboard grid can be restructured without prop drilling.

### Dashboard page is a server component
`app/(dashboard)/dashboard/page.tsx` has no "use client". All client-side data fetching lives inside leaf components. This keeps the page lightweight and enables Next.js metadata export (`export const metadata`).

---

## Implementation Steps

1. Created `useProfile` and `useCurrentlyPlaying` hooks with TanStack Query
2. Built `Skeleton` base + all named preset skeletons
3. Built `ErrorState` and `EmptyState` shared components
4. Built `StatCard` and `SectionHeader` shared components
5. Updated shared `index.ts` barrel
6. Built `ProfileHeader` with avatar fallback (initials), badge row, Spotify link
7. Built `CurrentlyPlaying` with Framer Motion sound bars + progress bar
8. Built `StatsOverview` deriving stats from cached queries
9. Built `QuickTopArtists` (grid) and `QuickTopTracks` (list) preview components
10. Updated profile feature `index.ts`
11. Rewrote dashboard `page.tsx` as pure composition
12. Updated `Topbar` with real page titles + responsive short labels on mobile

---

## Improvements

- [ ] Add `useRecentlyPlayed` hook and "Recently Played" section on dashboard
- [ ] Add popularity bar visualization to track rows
- [ ] Add `next/image` blur placeholder for album art
- [ ] Add keyboard shortcut to toggle time range
- [ ] Animate stat card numbers counting up on load
