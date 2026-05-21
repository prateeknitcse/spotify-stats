"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { useAppStore } from "@/stores/useAppStore";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated, isLoading, hasError, logout } = useAuth();
  const router = useRouter();
  const { isSidebarOpen, setSidebarOpen } = useAppStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (hasError) logout();
  }, [hasError, logout]);

  useEffect(() => {
    if (!isMobile && isSidebarOpen) setSidebarOpen(false);
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
      <ScrollToTop />
      <Sidebar />

      {/* Mobile overlay */}
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

      <div className={cn("flex min-w-0 flex-1 flex-col transition-all duration-300", "lg:ml-64")}>
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
