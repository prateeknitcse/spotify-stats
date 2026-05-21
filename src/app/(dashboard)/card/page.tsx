"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, RefreshCw, Share2, Check } from "lucide-react";
import { toPng } from "html-to-image";
import { ShareableCard } from "@/features/personality/components/ShareableCard";
import { usePersonality } from "@/features/personality/hooks/usePersonality";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import { useAppStore } from "@/stores/useAppStore";
import { TIME_RANGE_OPTIONS } from "@/lib/constants";

// ─── Card Export Page ─────────────────────────────────────────────────────────

export default function CardPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { selectedTimeRange } = useAppStore();
  const personality = usePersonality(selectedTimeRange);
  const { data: profile } = useProfile();

  const timeRangeLabel = TIME_RANGE_OPTIONS.find(
    (o) => o.value === selectedTimeRange
  )?.label ?? "All Time";

  // ── Export as PNG ──────────────────────────────────────────────────────────
  const handleExport = useCallback(async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2, // 2x for retina-quality export
        backgroundColor: "#0f0f0f",
        // Ensure fonts load before capture
        fontEmbedCSS: "",
      });

      // Trigger browser download
      const link = document.createElement("a");
      link.download = `spotify-personality-${profile?.display_name ?? "card"}.png`;
      link.href = dataUrl;
      link.click();

      setExported(true);
      setTimeout(() => setExported(false), 2500);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  }, [profile]);

  // ── Copy image to clipboard ────────────────────────────────────────────────
  const handleCopy = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: "#0f0f0f" });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }, []);

  const isLoading = personality.isLoading;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <SectionHeader
          title="Your Music Card"
          subtitle="Download and share your music personality"
          icon={Share2}
        />

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={isLoading || isExporting}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted disabled:opacity-50"
          >
            {isCopied ? <Check className="h-4 w-4 text-primary" /> : <Share2 className="h-4 w-4" />}
            {isCopied ? "Copied!" : "Copy Image"}
          </button>

          <button
            onClick={handleExport}
            disabled={isLoading || isExporting}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            {isExporting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : exported ? (
              <Check className="h-4 w-4" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? "Exporting..." : exported ? "Downloaded!" : "Download PNG"}
          </button>
        </div>
      </motion.div>

      {/* Card preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center"
      >
        {isLoading ? (
          <Skeleton className="h-[680px] w-[480px] rounded-3xl" />
        ) : (
          <div className="overflow-hidden rounded-3xl shadow-2xl shadow-primary/10 ring-1 ring-primary/10">
            <ShareableCard
              ref={cardRef}
              personality={personality}
              userName={profile?.display_name ?? "Spotify User"}
              userImage={profile?.images?.[0]?.url}
              timeRangeLabel={timeRangeLabel}
            />
          </div>
        )}
      </motion.div>

      {/* Tips */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <p className="mb-3 text-sm font-semibold text-foreground">Tips for sharing</p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">→</span>
              Download the PNG for Instagram Stories or Twitter/X
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">→</span>
              Use "Copy Image" to paste directly into messages or Discord
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">→</span>
              Switch time ranges in the top bar for different card flavors
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}
