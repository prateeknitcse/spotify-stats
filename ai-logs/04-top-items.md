# Feature: 04 — Top Artists & Tracks Full Pages

**Date:** 2026-19  
**Module:** 04 of 10  
**Status:** ✅ Complete

---

## Goal

Build full dedicated pages for top artists and top tracks with ranked displays, popularity visualizations, view toggles, and polished Recharts bar charts.

---

## What We Built

| File | Purpose |
|---|---|
| `features/top-items/hooks/useTopArtists.ts` | TanStack Query — fetches 50 top artists |
| `features/top-items/hooks/useTopTracks.ts` | TanStack Query — fetches 50 top tracks |
| `features/top-items/components/ArtistCard.tsx` | Dual-mode card: grid (square) + list (row) |
| `features/top-items/components/ArtistGrid.tsx` | Grid/list toggle, full 50-artist display |
| `features/top-items/components/TrackRow.tsx` | Track row with popularity bar + TrackRowHeader |
| `features/top-items/components/TrackList.tsx` | Full 50-track list with column headers |
| `features/top-items/components/PopularityChart.tsx` | Recharts horizontal bar chart, top 10 |
| `app/(dashboard)/artists/page.tsx` | Top Artists page |
| `app/(dashboard)/tracks/page.tsx` | Top Tracks page with quick stat pills |

---

## Architecture Decisions

### ArtistCard dual-mode (grid + list)
One component handles both views via a `view` prop. This avoids duplicating hover/animation logic. The parent `ArtistGrid` owns the `view` state and passes it down — clean separation of state vs presentation.

### PopularityChart color scale
Colors shift from blue → teal → green based on popularity score, reinforcing the data visually without needing a legend. High popularity = Spotify green. Low = blue. This is a UX pattern called "redundant encoding."

### TrackRowHeader as separate export
The header row is separate from `TrackRow` so the container (`TrackList`) controls whether to show it. If we embed it in a compact widget elsewhere, we can omit it cleanly.

### Quick stat pills on Tracks page
Total duration, avg popularity, and explicit count are derived entirely from the already-fetched track data — zero extra API calls. Shows data density without overwhelming the UI.

### Recharts ResponsiveContainer
Wrapping in `ResponsiveContainer width="100%" height={280}` means the chart adapts to any column width automatically — works on mobile and desktop without media queries in JS.

---

## Implementation Steps

1. Created `useTopArtists` and `useTopTracks` hooks (thin wrappers over spotifyClient)
2. Built `ArtistCard` with grid and list variants + staggered entrance animations
3. Built `ArtistGrid` with view toggle state (grid/list) and skeleton states
4. Built `TrackRow` with rank badge, popularity bar, explicit badge, duration
5. Built `TrackRowHeader` for table column labels
6. Built `TrackList` composing header + rows + skeletons
7. Built `PopularityChart` with Recharts, custom tooltip, color scale
8. Updated `top-items/index.ts` barrel
9. Wrote Artists page — header + chart + grid
10. Wrote Tracks page — header + stat pills + chart + list

---

## Improvements

- [ ] Add "Load more" pagination (offset-based) for > 50 results
- [ ] Add track preview audio player (30s preview via `preview_url`)
- [ ] Add artist detail modal/sheet on click (genres, top tracks)
- [ ] Add sort controls (by popularity, by name, by rank)
- [ ] Animate chart bars on time range change
- [ ] Add blur placeholder for `next/image` album art
