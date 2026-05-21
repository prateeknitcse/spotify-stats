"use client";

import { useState, useCallback, createContext, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timerRef.current.get(id);
    if (timer) clearTimeout(timer);
    timerRef.current.delete(id);
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, type }]);

      const timer = setTimeout(() => dismiss(id), 3500);
      timerRef.current.set(id, timer);
    },
    [dismiss]
  );

  const ICONS = { success: CheckCircle, error: AlertCircle, info: Info };
  const COLORS = {
    success: "border-primary/30 bg-primary/10 text-primary",
    error: "border-destructive/30 bg-destructive/10 text-destructive",
    info: "border-border bg-card text-foreground",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm",
                  "min-w-[220px] max-w-[320px]",
                  COLORS[t.type]
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <p className="flex-1 text-sm font-medium">{t.message}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  className="flex-shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
