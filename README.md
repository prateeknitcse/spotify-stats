# 🎵 Spotify Stats Dashboard

A production-quality Spotify analytics dashboard — a [stats.fm](https://stats.fm) clone built as a coding challenge.

## Features

- 🔐 Spotify OAuth authentication
- 👤 User profile dashboard
- 🎤 Top artists (4 weeks / 6 months / all time)
- 🎵 Top tracks (4 weeks / 6 months / all time)
- 🏷️ Genre analytics + visualization
- 🗺️ Listening behavior heatmaps
- 🧠 Mood / personality analysis
- 🃏 Shareable music personality card
- 📸 Export card as image
- 📱 Responsive mobile-first UI

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn UI |
| Animations | Framer Motion |
| Charts | Recharts |
| API | Spotify Web API |
| State | Zustand |
| Data Fetching | TanStack Query |
| Auth | NextAuth.js |
| Export | html-to-image |

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd spotify-stats
npm install
```

### 2. Set up Spotify app

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://localhost:3000/api/auth/callback/spotify`
4. Copy Client ID and Client Secret

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=run: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Globally reusable UI components
│   ├── layout/             # AppShell, Sidebar, Topbar
│   ├── shared/             # LoadingSkeleton, ErrorState, EmptyState
│   └── ui/                 # Shadcn auto-generated components
├── features/               # Feature-based modules (co-located)
│   ├── auth/
│   ├── profile/
│   ├── top-items/
│   ├── genres/
│   ├── heatmap/
│   └── personality/
├── hooks/                  # Global reusable hooks
├── lib/                    # Pure utility libraries
│   └── spotify/            # Centralized Spotify API client
├── stores/                 # Zustand global state
├── styles/                 # Additional CSS
└── types/                  # TypeScript type definitions
```

## AI Development Logs

All AI-assisted development is documented in `/ai-logs/`:

| Module | Feature | Status |
|---|---|---|
| 01 | Project Init & Architecture | ✅ |
| 02 | Spotify OAuth Auth | 🔜 |
| 03 | Profile Dashboard | 🔜 |
| 04 | Top Artists & Tracks | 🔜 |
| 05 | Genre Analytics | 🔜 |
| 06 | Listening Heatmaps | 🔜 |
| 07 | Personality Analysis | 🔜 |
| 08 | Shareable Card + Export | 🔜 |

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run type-check   # TypeScript check without building
npm run lint         # ESLint
npm run format       # Prettier
```
