# Feature: 08 — Shareable Personality Card + Export

**Date:** 2026-21
**Module:** 08 of 10
**Status:** ✅ Complete

## Goal
Generate a beautiful shareable card and export it as a PNG via html-to-image.

## What We Built
- `ShareableCard` component — forwardRef, inline styles for html-to-image compat
- `/dashboard/card` page — preview + Download PNG + Copy Image buttons
- 2x pixelRatio export for retina-quality PNG

## Architecture Decisions
- All styles inline (not CSS vars) — html-to-image doesn't resolve CSS custom properties at export time
- forwardRef pattern — parent owns the ref and passes it to html-to-image
- toPng with pixelRatio: 2 — doubles export resolution for sharp Instagram/Twitter images
- Copy to clipboard via ClipboardItem API — native browser sharing without a server
