"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface LoginButtonProps {
  className?: string;
  size?: "default" | "lg";
}

// ─── LoginButton ──────────────────────────────────────────────────────────────
// Spotify-branded sign-in button with loading state.
// Handles the OAuth redirect — shows spinner while redirecting.

export function LoginButton({ className, size = "default" }: LoginButtonProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch {
      setIsLoading(false);
    }
    // Don't reset loading — page will redirect
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={cn(
        "group relative inline-flex items-center justify-center gap-3",
        "rounded-full font-semibold transition-all duration-200",
        "bg-[#1DB954] text-black hover:bg-[#1ed760] hover:scale-105",
        "active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1DB954] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        size === "lg" ? "h-14 px-10 text-base" : "h-12 px-8 text-sm",
        className
      )}
      aria-label="Continue with Spotify"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <SpotifyIcon className="h-5 w-5 flex-shrink-0" />
      )}
      <span>{isLoading ? "Connecting..." : "Continue with Spotify"}</span>
    </button>
  );
}

// Inline Spotify SVG — avoids external image dependency
function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
