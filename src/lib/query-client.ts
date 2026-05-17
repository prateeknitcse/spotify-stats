import { QueryClient } from "@tanstack/react-query";

// ─── Query Client Factory ─────────────────────────────────────────────────────
// Creates a new QueryClient with production-optimized defaults.
// Called on server (per-request) and once on the browser (singleton).

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data considered fresh for 5 minutes.
        // Prevents hammering the Spotify API on every navigation.
        staleTime: 5 * 60 * 1000,

        // Keep unused data in cache for 10 minutes.
        // User can navigate back without a refetch.
        gcTime: 10 * 60 * 1000,

        // Retry once on failure with exponential backoff (TanStack default).
        retry: 1,

        // Don't refetch when window regains focus.
        // Spotify listening data doesn't change that fast.
        refetchOnWindowFocus: false,

        // Don't refetch when reconnecting to network.
        refetchOnReconnect: false,
      },
      mutations: {
        // Don't retry mutations — they may have side effects.
        retry: 0,
      },
    },
  });
}

// ─── Browser Singleton ────────────────────────────────────────────────────────
// On the browser, we keep one QueryClient instance alive.
// Recreating it on re-renders would wipe the cache.
// On the server, we always create a fresh one (per-request isolation).

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always make a new query client (no shared state between requests)
    return makeQueryClient();
  }

  // Browser: create once, reuse forever
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
