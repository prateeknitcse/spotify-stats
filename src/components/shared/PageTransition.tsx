"use client";

import { motion } from "framer-motion";

// ─── PageTransition ───────────────────────────────────────────────────────────
// Wraps every dashboard page for consistent fade+slide entrance.
// Used in each page file — keeps transition logic in one place.

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
