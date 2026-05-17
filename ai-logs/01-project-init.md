# Feature: 01 — Project Initialization & Architecture Foundation

**Date:** 17/05/2026  
**Module:** 01 of 10  
**Status:** ✅ Complete

---

## Goal

Establish a production-grade foundation for a Spotify analytics dashboard (stats.fm clone) with correct folder architecture, typed API layer, theming system, and base configuration — before any feature work begins.

---

## What We Built

| File/Folder | Purpose |
|---|---|
| `src/types/spotify.ts` | Full Spotify API TypeScript interfaces |
| `src/types/app.ts` | App-specific types (UI state, derived data) |
| `src/lib/constants.ts` | Time ranges, scopes, query keys, chart colors |
| `src/lib/utils.ts` | cn(), formatNumber(), getBestImage(), aggregateGenres() |
| `src/lib/query-client.ts` | TanStack Query singleton, SSR-safe |
| `src/lib/spotify/client.ts` | Centralized Spotify API client |
| `src/lib/spotify/auth.ts` | Token refresh logic |
| `src/stores/useAppStore.ts` | Zustand store with devtools + persistence |
| `src/hooks/useMediaQuery.ts` | SSR-safe responsive hooks |
| `src/hooks/useSpotifySession.ts` | Typed NextAuth session wrapper |
| `src/app/globals.css` | Full dark theme, design tokens, utility classes |
| `src/app/layout.tsx` | Root layout, metadata, ThemeProvider |
| `src/components/layout/Providers.tsx` | QueryClientProvider client wrapper |
| `tailwind.config.ts` | Extended with Spotify colors, animations |
| `next.config.ts` | Spotify CDN image domains |
| `src/styles/animations.css` | Custom CSS animations |

---

## Prompt Used

> "You are acting as a senior full-stack engineer and product architect. Build a production-quality clone of stats.fm for Spotify for a coding challenge..."

---

## AI Assistance Summary

Claude guided every architectural decision, generated all boilerplate with production quality, explained tradeoffs between alternatives (Zustand vs Context, TanStack Query vs SWR, feature-based vs type-based folders), and maintained consistency across all files.

---

## Architecture Decisions

### Feature-based folder structure

**Decision:** `src/features/auth/`, `src/features/top-items/` etc.  
**Alternative:** Type-based: `src/components/`, `src/hooks/`, `src/utils/`  
**Why feature-based:** As features grow, related code stays co-located. Deleting a feature is one folder delete. Onboarding is faster — "everything about top-items lives in `features/top-items/`".

### TanStack Query over SWR

**Decision:** `@tanstack/react-query`  
**Why:** Better TypeScript generics, `gcTime` vs `staleTime` separation, better devtools, easier cache invalidation with typed query keys, supports optimistic updates.

### Zustand over Context API + useReducer

**Decision:** `zustand` with devtools + persist middleware  
**Why:** Context causes full subtree re-renders. Zustand uses selectors — only subscribed slices re-render. Persist middleware gives free localStorage sync for user preferences.

### CSS Custom Properties for theming

**Decision:** All colors as `hsl(var(--token))`  
**Why:** Shadcn compatibility, runtime switchable without rebuild, maps to standard Radix UI / Shadcn patterns. All design decisions in one place.

### `defaultTheme="dark"` with `enableSystem={false}`

**Decision:** Force dark, no system detection  
**Why:** The app is Spotify-inspired — dark is the intended experience. System detection causes theme flash on load. Explicit dark avoids the FOIT.

### Centralized Spotify client (`lib/spotify/client.ts`)

**Decision:** One `spotifyFetch()` function + typed method object  
**Why:** All HTTP calls centralized = one place to add auth headers, one place to handle errors, one place to mock in tests. No component ever calls `fetch()` for Spotify.

### Query keys as typed constants

**Decision:** `QUERY_KEYS.topArtists(timeRange)` returns `readonly ["spotify", "top-artists", string]`  
**Why:** Prevents typos causing cache bugs. Enables precise cache invalidation. Self-documenting — you can see the full query key tree in one file.

---

## Implementation Steps

1. Designed full folder structure on paper before any code
2. Defined all TypeScript types (`spotify.ts`, `app.ts`) before any logic
3. Built utility layer (`utils.ts`, `constants.ts`) — pure functions, no side effects
4. Configured TanStack Query with browser-singleton pattern
5. Created Spotify API client with typed methods and error class
6. Set up Zustand with devtools + localStorage persistence
7. Extended Tailwind with Spotify brand colors and custom animations
8. Wrote full dark theme CSS with design token system
9. Created root layout with proper metadata and providers hierarchy
10. Added SSR-safe media query and session hooks
11. Created placeholder pages to validate routing structure

---

## Problems Encountered

None at initialization stage. Key risks avoided:

- **Hydration mismatch** — avoided by `suppressHydrationWarning` on `<html>` and SSR-safe `useMediaQuery` (returns `false` on server)
- **Query client recreation** — avoided by browser singleton pattern
- **Secret leakage** — avoided by `.env.local` in `.gitignore` from day one

---

## Improvements

- [ ] Add Storybook for isolated component development
- [ ] Add Playwright E2E test config
- [ ] Add GitHub Actions CI/CD (lint + type-check on PR)
- [ ] Add bundle analyzer for tracking JS size
- [ ] Add MSW (Mock Service Worker) for API mocking in dev
- [ ] Add Sentry error tracking config
- [ ] Consider adding `next/font` for self-hosted fonts instead of `geist` package
