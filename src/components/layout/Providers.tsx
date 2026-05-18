"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/query-client";

// ─── Providers ────────────────────────────────────────────────────────────────
// All client-side providers in one place.
// Order: SessionProvider → QueryClientProvider → children
// SessionProvider wraps everything so useSession() works anywhere.

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <SessionProvider
      refetchInterval={45 * 60}
      refetchOnWindowFocus={true}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        )}
      </QueryClientProvider>
    </SessionProvider>
  );
}
