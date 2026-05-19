"use client";

import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── ErrorState ───────────────────────────────────────────────────────────────
// Generic error display with optional retry action.
// Used whenever a query fails — keeps UX consistent across all features.

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message = "Failed to load data from Spotify. Check your connection and try again.",
  onRetry,
  className,
  compact = false,
}: ErrorStateProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3",
          className
        )}
      >
        <AlertCircle className="h-4 w-4 flex-shrink-0 text-destructive" />
        <p className="text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-14 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <WifiOff className="h-6 w-6 text-destructive" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  className?: string;
}

export function EmptyState({ icon, title, message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-14 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
