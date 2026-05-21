"use client";

import { forwardRef } from "react";
import { Music } from "lucide-react";
import type { PersonalityResult } from "@/features/personality/hooks/usePersonality";

interface ShareableCardProps {
  personality: PersonalityResult;
  userName: string;
  userImage?: string | null;
  timeRangeLabel: string;
}

// ─── ShareableCard ────────────────────────────────────────────────────────────
// The exportable card. Uses forwardRef so the parent can pass the ref
// to html-to-image for PNG export.
// Hardcoded dark styles (no CSS vars) — image export doesn't resolve CSS vars.

export const ShareableCard = forwardRef<HTMLDivElement, ShareableCardProps>(
  ({ personality, userName, userImage, timeRangeLabel }, ref) => {
    const mood = personality.primaryMood;

    return (
      <div
        ref={ref}
        style={{
          width: 480,
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0d1f14 100%)",
          borderRadius: 24,
          padding: 32,
          fontFamily: "'Inter', system-ui, sans-serif",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(29,185,84,0.2)",
        }}
      >
        {/* Background decoration */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 200, height: 200, borderRadius: "50%",
          background: `radial-gradient(circle, ${mood.color}20 0%, transparent 70%)`,
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -40,
          width: 160, height: 160, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(29,185,84,0.1) 0%, transparent 70%)",
        }} />

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "#1DB954", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 14 }}>♪</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#aaa", letterSpacing: 1 }}>
              SPOTIFY STATS
            </span>
          </div>
          <span style={{ fontSize: 11, color: "#666", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 20 }}>
            {timeRangeLabel}
          </span>
        </div>

        {/* User info */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          {userImage ? (
            <img src={userImage} alt={userName} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(29,185,84,0.4)" }} />
          ) : (
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(29,185,84,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#1DB954" }}>
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{userName}</p>
            <p style={{ fontSize: 12, color: "#888" }}>Music Personality</p>
          </div>
        </div>

        {/* Personality type */}
        <div style={{
          background: "rgba(255,255,255,0.04)", borderRadius: 16,
          padding: "16px 20px", marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>{mood.emoji}</span>
            <div>
              <p style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>{personality.personalityType}</p>
              <p style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{mood.label} · {mood.description}</p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>{personality.personalityDescription}</p>
        </div>

        {/* Top genres */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#555", letterSpacing: 1.5, marginBottom: 10, textTransform: "uppercase" }}>
            Top Genres
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {personality.topGenres.slice(0, 5).map((g) => (
              <span key={g} style={{
                background: "rgba(29,185,84,0.12)", border: "1px solid rgba(29,185,84,0.3)",
                color: "#1DB954", borderRadius: 20, padding: "4px 12px",
                fontSize: 11, fontWeight: 600,
              }}>
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Mood bars */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#555", letterSpacing: 1.5, marginBottom: 10, textTransform: "uppercase" }}>
            Mood Profile
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {personality.allMoods.slice(0, 4).map((m) => (
              <div key={m.mood} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, width: 18 }}>{m.emoji}</span>
                <span style={{ fontSize: 11, color: "#aaa", width: 72 }}>{m.label}</span>
                <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${m.score}%`, background: m.color, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 10, color: "#666", width: 24, textAlign: "right" }}>{m.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Anthem track */}
        {personality.topTrackName !== "—" && (
          <div style={{
            background: "rgba(255,255,255,0.03)", borderRadius: 12,
            padding: "12px 16px", marginBottom: 20,
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(29,185,84,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16 }}>🎵</span>
            </div>
            <div>
              <p style={{ fontSize: 10, color: "#555", letterSpacing: 1, marginBottom: 3, textTransform: "uppercase", fontWeight: 600 }}>Anthem Track</p>
              <p style={{ fontSize: 13, fontWeight: 700 }}>{personality.topTrackName}</p>
              <p style={{ fontSize: 11, color: "#888" }}>{personality.topTrackArtist}</p>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Mainstream", value: `${personality.mainstreamScore}%` },
            { label: "Diversity", value: `${personality.diversityScore}%` },
            { label: "Peak Time", value: personality.listeningPeriod.replace(" Listener", "").replace(" Owl", "") },
          ].map((s) => (
            <div key={s.label} style={{
              flex: 1, background: "rgba(255,255,255,0.04)",
              borderRadius: 10, padding: "10px 12px",
              border: "1px solid rgba(255,255,255,0.05)", textAlign: "center",
            }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1DB954" }}>{s.value}</p>
              <p style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#444" }}>stats.fm clone · Built with Next.js</span>
          <span style={{ fontSize: 10, color: "#1DB954", fontWeight: 600 }}>spotify-stats.app</span>
        </div>
      </div>
    );
  }
);

ShareableCard.displayName = "ShareableCard";
