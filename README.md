# 🎵 Spotify Stats Dashboard

A production-quality Spotify analytics dashboard — a [stats.fm](https://stats.fm) clone built as a coding challenge using Next.js 15, TypeScript, Tailwind CSS, and the Spotify Web API.

## ✨ Features

| Feature | Route |
|---|---|
| 🔐 Spotify OAuth with auto token refresh | `/` |
| 👤 User profile dashboard | `/dashboard` |
| 🎤 Top Artists (4W / 6M / All time) | `/dashboard/artists` |
| 🎵 Top Tracks with popularity chart | `/dashboard/tracks` |
| 🏷️ Genre analytics — donut + bars + tag cloud | `/dashboard/genres` |
| 🗺️ Listening patterns — hour + day heatmaps | `/dashboard/patterns` |
| 🧠 Music personality & mood analysis | `/dashboard/personality` |
| 🃏 Shareable card — download PNG / copy | `/dashboard/card` |

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn UI |
| Animations | Framer Motion |
| Charts | Recharts |
| API | Spotify Web API |
| Auth | NextAuth.js v4 |
| State | Zustand (UI) + TanStack Query (server) |
| Export | html-to-image |

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd spotify-stats
npm install
```

### 2. Create Spotify app

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Create app → add redirect URI: `http://localhost:3000/api/auth/callback/spotify`
3. Copy **Client ID** and **Client Secret**

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run

```bash
npm run dev
# → http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth route group
│   ├── (dashboard)/        # Protected dashboard routes
│   └── api/auth/           # NextAuth handler
├── components/
│   ├── layout/             # AppShell, Sidebar, Topbar, Providers
│   └── shared/             # Skeleton, ErrorState, StatCard, Toast...
├── features/               # Feature-based modules
│   ├── auth/               # Login, useAuth
│   ├── profile/            # ProfileHeader, CurrentlyPlaying
│   ├── top-items/          # ArtistCard, TrackRow, PopularityChart
│   ├── genres/             # DonutChart, BarList, TagCloud
│   ├── heatmap/            # HourlyChart, DayGrid, PatternSummary
│   └── personality/        # MoodRadar, ShareableCard, usePersonality
├── hooks/                  # useMediaQuery, useSpotifySession
├── lib/                    # utils, constants, query-client, spotify client
├── stores/                 # Zustand app store
└── types/                  # Spotify + App TypeScript types
```

## 📝 AI Development Logs

See `/ai-logs/` for module-by-module documentation of all AI-assisted decisions.

| Module | Feature |
|---|---|
| 01 | Project Init & Architecture |
| 02 | Spotify OAuth |
| 03 | Profile Dashboard |
| 04 | Top Artists & Tracks |
| 05 | Genre Analytics |
| 06 | Listening Patterns |
| 07 | Personality Analysis |
| 08 | Shareable Card & Export |
| 09 | Responsive Polish & Animations |
| 10 | Production Hardening |

## 🧪 Scripts

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run type-check   # TypeScript check
npm run lint         # ESLint
npm run format       # Prettier
```
