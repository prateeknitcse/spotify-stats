# Feature: 07 — Mood & Personality Analysis

**Date:** 2026-21
**Module:** 07 of 10
**Status:** ✅ Complete

## Goal
Derive a music personality profile from top tracks/artists + listening patterns.
Show mood radar, mood bars, personality type, and key stats.

## What We Built
- `usePersonality` hook — derives personality from 3 cached queries
- `MoodRadar` — Recharts radar chart for 6 mood dimensions
- `MoodBreakdown` — animated bar list for each mood score
- `PersonalityStats` — mainstream/diversity/listening-style cards
- `/dashboard/personality` page — full personality analysis

## Architecture Decisions
- No audio features API call — mood inferred from genre keywords + popularity + listening period
- useMemo over all three queries — single derived object, no extra fetches
- 12 personality archetypes derived from genre string matching + behavioural signals
- Mood scores 0-100 with a guaranteed minimum of 10 to avoid flat radar
