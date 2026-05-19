"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart2, Music, Sparkles } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoginButton } from "@/features/auth/components/LoginButton";
import { FeatureGrid } from "@/features/auth/components/FeatureGrid";
import { AnimatedBackground } from "@/features/auth/components/AnimatedBackground";

// Isolated because useSearchParams() requires Suspense in Next.js 15
function AuthErrorBanner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!error) return null;

  const message =
    error === "session_expired"
      ? "Your session expired. Please sign in again."
      : error === "OAuthCallback"
        ? "OAuth callback failed. Check your Spotify app redirect URI."
        : error === "Configuration"
          ? "Server configuration error. Check your environment variables."
          : "Authentication failed. Please try again.";

  return (
    <motion.p
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400"
    >
      ⚠️ {message}
    </motion.p>
  );
}

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-2 w-2 animate-ping rounded-full bg-[#1DB954]" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <AnimatedBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-20 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954]">
              <Music className="h-4 w-4 text-black" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white/80">
              Spotify Stats
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1DB954]" />
            Free · No credit card
          </div>
        </motion.header>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-1.5 text-xs font-medium text-[#1DB954]">
            <Sparkles className="h-3 w-3" />
            Your music. Beautifully visualized.
          </div>

          <h1 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Discover your
            <br />
            <span className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">
              music identity
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
            Connect your Spotify account and get a deep-dive analytics dashboard
            — top artists, tracks, genre breakdowns, listening patterns, and a
            shareable personality card.
          </p>

          <div className="flex flex-col items-center gap-4">
            <LoginButton size="lg" />
            <Suspense fallback={null}>
              <AuthErrorBanner />
            </Suspense>
            <p className="text-xs text-white/25">
              We only read your listening data — we never modify your library.
            </p>
          </div>
        </motion.section>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16 grid grid-cols-3 divide-x divide-white/5 rounded-2xl border border-white/5 bg-white/[0.03] py-6"
        >
          {[
            { icon: BarChart2, value: "50+", label: "Data points" },
            { icon: Music, value: "3×", label: "Time ranges" },
            { icon: Sparkles, value: "1-click", label: "Share card" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 px-6">
              <Icon className="mb-1 h-4 w-4 text-[#1DB954]" />
              <span className="text-xl font-bold text-white">{value}</span>
              <span className="text-xs text-white/40">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-white/25">
            Everything in one dashboard
          </p>
          <FeatureGrid />
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center text-xs text-white/20"
        >
          Not affiliated with Spotify AB · Built with Next.js 15
        </motion.footer>
      </div>
    </main>
  );
}
