"use client";

import { Menu } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { TIME_RANGE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ─── Topbar ───────────────────────────────────────────────────────────────────
// Sticky top bar with:
// - Hamburger menu (mobile only)
// - Page title (injected via context in future)
// - Global time range selector (shared across all top-items views)

export function Topbar() {
  const { toggleSidebar, selectedTimeRange, setSelectedTimeRange } = useAppStore();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* ── Left: mobile menu button ── */}
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Page title slot — will be populated by each page in future */}
        <div className="hidden sm:block">
          <div className="h-4 w-32 rounded bg-muted/50" aria-hidden="true" />
        </div>
      </div>

      {/* ── Right: time range selector ── */}
      <nav
        className="flex items-center rounded-xl border border-border bg-card p-1"
        aria-label="Time range"
      >
        {TIME_RANGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedTimeRange(option.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150",
              selectedTimeRange === option.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={selectedTimeRange === option.value}
            title={option.description}
          >
            {option.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
