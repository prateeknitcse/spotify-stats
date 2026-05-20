# Feature: 06 — Listening Patterns Heatmap

**Date:** 2026-20
**Module:** 06 of 10
**Status:** ✅ Complete

---

## Goal

Analyze the user's recently played timestamps to reveal when they listen to music — hour-of-day bar chart, day-of-week activity grid, period breakdown, and summary insight cards.

---

## What We Built

| File | Purpose |
|---|---|
| `features/heatmap/hooks/useListeningPatterns.ts` | Fetches recently played, derives hourly + daily distributions |
| `features/heatmap/components/HourlyChart.tsx` | 24-bar Recharts chart with period dividers |
| `features/heatmap/components/DayOfWeekGrid.tsx` | 7-cell intensity grid with peak crown |
| `features/heatmap/components/PatternSummary.tsx` | 4 summary cards: peak hour, day, style, total |
| `app/(dashboard)/patterns/page.tsx` | Full patterns page |

---

## Architecture Decisions

### useMemo for timestamp analysis
All data crunching happens in `useMemo` inside the hook — not in the component, not in useEffect. This means: runs once when data arrives, runs again only when data changes, never blocks render.

### Intensity normalization (0–1)
Raw counts are normalized against the max count for that dimension. This lets the color/opacity encode relative activity meaningfully — if Monday has 10 tracks and Tuesday has 2, Tuesday shows at 20% intensity. Absolute counts are shown in labels.

### ReferenceLine for period dividers
Recharts `ReferenceLine` components at hours 6, 12, 18 add visual context to the hourly chart without needing a legend — you can see where night ends and morning begins at a glance.

### DayOfWeekGrid as a custom grid (not Recharts)
A 7-cell CSS grid is cleaner than a bar chart for days — each cell can show both the day label and count, and the visual weight (background color) naturally encodes activity. Recharts would be overkill here.

### Listening period derived from period with max tracks
Simple argmax over [morning, afternoon, evening, night] counts. Maps to a label + icon. This feeds into Module 07 (personality) — same logic, reused.

---

## Implementation Steps

1. Created `useListeningPatterns` — fetches 50 recent plays, aggregates to hourly + daily arrays
2. Built `HourlyChart` — 24 bars, peak highlighted green, others opacity-scaled, period dividers
3. Built `DayOfWeekGrid` — 7 cells, intensity color fill, peak day crown emoji
4. Built `PatternSummary` — 4 cards with dynamic period icon (Sunrise/Sun/Sunset/Moon)
5. Built patterns page — summary → hourly → daily → period breakdown
6. Added period breakdown section showing % per time-of-day block

---

## Improvements

- [ ] Use user's timezone for accurate timestamps (Spotify returns UTC)
- [ ] Add a full 7×24 heatmap grid (GitHub-style contribution graph)
- [ ] Compare patterns across time ranges
- [ ] Add "you listen most during weekends/weekdays" insight
- [ ] Animate bars when data first loads (bar grow from bottom)
