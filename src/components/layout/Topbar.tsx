"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { TIME_RANGE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/artists": "Top Artists",
  "/dashboard/tracks": "Top Tracks",
  "/dashboard/genres": "Genre Analytics",
  "/dashboard/patterns": "Listening Patterns",
  "/dashboard/personality": "Music Personality",
};

export function Topbar() {
  const pathname = usePathname();
  const { toggleSidebar, selectedTimeRange, setSelectedTimeRange } = useAppStore();
  const isMobile = useIsMobile();

  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-base font-semibold text-foreground">{pageTitle}</h1>
      </div>

      {/* Right: time range selector */}
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
            {/* Short labels on mobile */}
            <span className="sm:hidden">
              {option.value === "short_term" ? "4W" : option.value === "medium_term" ? "6M" : "All"}
            </span>
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
