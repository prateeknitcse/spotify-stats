# Feature: 02 — Spotify OAuth Authentication

**Date:** 2026-18  
**Module:** 02 of 10  
**Status:** ✅ Complete

---

## Goal

Implement production-grade Spotify OAuth using NextAuth.js with:
- Automatic access token refresh (Spotify tokens expire hourly)
- Typed session available everywhere in the app
- Edge middleware for instant route protection
- Polished landing page with feature preview
- Full dashboard shell (Sidebar + Topbar + AppShell)

---

## What We Built

| File | Purpose |
|---|---|
| `src/lib/auth.ts` | NextAuth config — provider, JWT/session callbacks, token refresh |
| `src/app/api/auth/[...nextauth]/route.ts` | App Router NextAuth handler |
| `src/types/next-auth.d.ts` | Module augmentation — adds accessToken to Session/JWT |
| `src/middleware.ts` | Edge middleware — protects /dashboard/* routes |
| `src/features/auth/hooks/useAuth.ts` | Typed auth state hook |
| `src/features/auth/components/LoginButton.tsx` | Spotify-branded OAuth button |
| `src/features/auth/components/AnimatedBackground.tsx` | Decorative landing background |
| `src/features/auth/components/FeatureGrid.tsx` | Feature preview cards |
| `src/app/page.tsx` | Polished landing page (replaced placeholder) |
| `src/components/layout/AppShell.tsx` | Authenticated layout wrapper |
| `src/components/layout/Sidebar.tsx` | Responsive sidebar with active state |
| `src/components/layout/Topbar.tsx` | Sticky topbar with time range selector |
| `src/app/(dashboard)/layout.tsx` | Dashboard route group layout |
| `src/components/layout/Providers.tsx` | Updated — added SessionProvider |

---

## Architecture Decisions

### JWT strategy over database sessions
**Why:** No database needed. Token stored in encrypted httpOnly cookie. The tradeoff is sessions can't be invalidated server-side (no session table to delete from), but for a read-only Spotify dashboard this is acceptable. If we needed server-side logout, we'd use database sessions.

### Token refresh in JWT callback
**Why:** The JWT callback runs on every session check. When `Date.now() > accessTokenExpires`, we call Spotify's token endpoint to get a fresh token. The user never sees an expired token — it refreshes transparently. If refresh fails, we set `error: "RefreshAccessTokenError"` and force re-login.

### Never expose refreshToken to client
**Why:** The session callback only forwards `accessToken`, not `refreshToken`. If a client-side script was compromised, the attacker could only use the access token (expires in 1hr), not get indefinite access via the refresh token.

### Edge middleware for route protection
**Why:** Runs before any React rendering. Zero chance of protected content flash. Faster than client-side `useEffect` redirect. Also catches the `RefreshAccessTokenError` case and redirects to login.

### useAuth() hook as single auth interface
**Why:** No component ever calls `useSession()` directly. If we change auth providers, we change one file (`useAuth.ts`), not every component. The hook also provides typed convenience methods (`login()`, `logout()`) with redirect logic built in.

### Framer Motion for landing page
**Why:** `motion.div` with `initial/animate` props gives hardware-accelerated entrance animations with ~3 lines of code. The staggered reveal (header → hero → stats bar → features) creates a polished, intentional feel that impresses in screenshots.

### `layoutId="sidebar-active"` for nav indicator
**Why:** Framer Motion's shared layout animation automatically morphs the active indicator between nav items. One line of code produces a fluid sliding underline effect — much better than CSS transitions alone.

---

## Implementation Steps

1. Created `lib/auth.ts` — NextAuth config with Spotify provider and token refresh logic
2. Created App Router handler at `api/auth/[...nextauth]/route.ts`
3. Extended NextAuth TypeScript types via module augmentation
4. Created edge middleware protecting `/dashboard/*`
5. Built `useAuth()` hook wrapping `useSession()` with typed return
6. Built `LoginButton` with loading state and Spotify SVG icon
7. Created `AnimatedBackground` with CSS floating orbs + grid overlay
8. Built `FeatureGrid` with hover cards (server component)
9. Replaced placeholder `page.tsx` with full landing page (Framer Motion animations)
10. Built `AppShell` — handles auth guard, loading state, mobile overlay
11. Built `Sidebar` — desktop fixed + mobile slide-in drawer, shared layout animation
12. Built `Topbar` — sticky, time range selector, mobile hamburger
13. Created `(dashboard)/layout.tsx` applying AppShell to all dashboard routes
14. Updated `Providers.tsx` to include `SessionProvider`

---

## Problems Encountered

### `jsx` in `.css` file (AnimatedBackground)
**Issue:** Used `<style jsx>` in AnimatedBackground — requires Next.js CSS-in-JS which needs styled-jsx config.  
**Solution:** Used inline `<style>` tag as standard HTML — works without any config.

### Middleware and App Router
**Issue:** `withAuth` from `next-auth/middleware` works differently in App Router.  
**Solution:** Export `config.matcher` to explicitly scope middleware to `/dashboard/:path*` only. API routes and static files are excluded automatically.

---

## Security Notes

- `NEXTAUTH_SECRET` must be at least 32 characters (generated with `openssl rand -base64 32`)
- Refresh token is never sent to the client (filtered in session callback)
- `httpOnly` cookies prevent XSS access to tokens
- Redirect URI must be whitelisted in Spotify Developer Dashboard

---

## Improvements

- [ ] Add PKCE flow for even stronger OAuth security
- [ ] Add loading skeleton for sidebar user section
- [ ] Add toast notification on session expiry
- [ ] Consider adding `next/image` for user avatar (better optimization than `<img>`)
- [ ] Add E2E test for the full OAuth flow with Playwright
- [ ] Add rate limiting to the auth API routes
