import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { TimeRange } from "@/types";

// ─── App Store ────────────────────────────────────────────────────────────────
// Global UI state that needs to be shared across many components.
// Per-feature data stays in TanStack Query — only UI state lives here.

interface AppState {
  // Time range selected in the top-items sections
  selectedTimeRange: TimeRange;
  setSelectedTimeRange: (range: TimeRange) => void;

  // Mobile sidebar visibility
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Top items display limit (20 or 50)
  displayLimit: 20 | 50;
  setDisplayLimit: (limit: 20 | 50) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Defaults
        selectedTimeRange: "short_term",
        isSidebarOpen: false,
        displayLimit: 20,

        // Actions
        setSelectedTimeRange: (range) => set({ selectedTimeRange: range }),
        toggleSidebar: () =>
          set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        setSidebarOpen: (open) => set({ isSidebarOpen: open }),
        setDisplayLimit: (limit) => set({ displayLimit: limit }),
      }),
      {
        name: "spotify-stats-app-store",
        // Only persist user preferences, not transient UI state
        partialize: (state) => ({
          selectedTimeRange: state.selectedTimeRange,
          displayLimit: state.displayLimit,
        }),
      }
    ),
    { name: "AppStore" }
  )
);
