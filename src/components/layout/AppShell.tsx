"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAppStore } from "@/stores/useAppStore";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

// ─── AppShell ─────────────────────────────────────────────────────────────────
// Authenticated layout wrapper.
// Handles: sidebar, topbar, mobile overlay, token error state.
// All dashboard pages render inside this shell.

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated, isLoading, hasError, logout } = useAuth();
  const router = useRouter();
  const { isSidebarOpen, setSidebarOpen } = useAppStore();
  const isMobile = useIsMobile();

  // Redirect if somehow on dashboard without auth (belt + suspenders with middleware)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Force re-login on token error
  useEffect(() => {
    if (hasError) {
      logout();
    }
  }, [hasError, logout]);

  // Close sidebar on desktop resize
  useEffect(() => {
    if (!isMobile && isSidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isMobile, isSidebarOpen, setSidebarOpen]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading your stats...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar (desktop: always visible, mobile: slide-over) ── */}
      <Sidebar />

      {/* ── Mobile overlay backdrop ── */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Main content area ── */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-all duration-300",
          "lg:ml-64" // Sidebar width on desktop
        )}
      >
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
