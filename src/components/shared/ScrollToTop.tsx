"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// ─── ScrollToTop ──────────────────────────────────────────────────────────────
// Scrolls to top on every route change.
// Include once in the dashboard layout.

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
