"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/query-client";

// ─── Providers ────────────────────────────────────────────────────────────────
// Client-side providers wrapper.
// Must be "use client" because QueryClientProvider is a client component.
// SessionProvider (NextAuth) will be added in Module 02.

export function Providers({ children }: { children: React.ReactNode }) {
  // getQueryClient() returns browser singleton — safe to call on every render
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* DevTools only in development — zero production bundle impact */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
