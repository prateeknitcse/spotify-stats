"use client";

export function AnimatedBackground() {
  const orbs = [
    { size: 300, x: "10%",  y: "20%", delay: "0s",   duration: "8s",  opacity: 0.06 },
    { size: 200, x: "75%",  y: "10%", delay: "1s",   duration: "10s", opacity: 0.05 },
    { size: 400, x: "60%",  y: "60%", delay: "2s",   duration: "12s", opacity: 0.04 },
    { size: 150, x: "20%",  y: "70%", delay: "0.5s", duration: "9s",  opacity: 0.07 },
    { size: 250, x: "85%",  y: "40%", delay: "3s",   duration: "11s", opacity: 0.05 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(29,185,84,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(29,185,84,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating green orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, rgba(29,185,84,${orb.opacity}) 0%, transparent 70%)`,
            animation: `bgFloat ${orb.duration} ease-in-out infinite alternate`,
            animationDelay: orb.delay,
            transform: "translate(-50%, -50%)",
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

      {/* Keyframes injected as plain <style> — no styled-jsx needed */}
      <style>{`
        @keyframes bgFloat {
          0%   { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-50%, -50%) scale(1.15) translateY(-20px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
