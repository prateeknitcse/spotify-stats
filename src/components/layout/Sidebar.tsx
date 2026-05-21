"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Mic2, Music, Tag, BarChart2, Sparkles, Share2, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppStore } from "@/stores/useAppStore";
import { useIsMobile } from "@/hooks/useMediaQuery";

const NAV_ITEMS = [
  { label: "Overview",    href: "/dashboard",             icon: LayoutDashboard, exact: true },
  { label: "Top Artists", href: "/dashboard/artists",     icon: Mic2 },
  { label: "Top Tracks",  href: "/dashboard/tracks",      icon: Music },
  { label: "Genres",      href: "/dashboard/genres",      icon: Tag },
  { label: "Patterns",    href: "/dashboard/patterns",    icon: BarChart2 },
  { label: "Personality", href: "/dashboard/personality", icon: Sparkles },
  { label: "Share Card",  href: "/dashboard/card",        icon: Share2 },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isSidebarOpen, setSidebarOpen } = useAppStore();
  const isMobile = useIsMobile();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const sidebarContent = (
    <nav className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Music className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold tracking-tight">Spotify Stats</span>
        </Link>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Close menu">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 px-3 py-2">
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Analytics</div>
        <ul className="space-y-0.5" role="list">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-primary/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <item.icon className={cn("relative h-4 w-4 flex-shrink-0 transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="relative">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* User */}
      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2">
          {user?.image && (
            <img src={user.image} alt={user.name ?? "Avatar"} className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name ?? "Spotify User"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label="Sign out">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </nav>
  );

  if (!isMobile) {
    return (
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        {sidebarContent}
      </aside>
    );
  }

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className="fixed inset-y-0 left-0 z-30 w-72 border-r border-border bg-card shadow-2xl lg:hidden"
        >
          {sidebarContent}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
