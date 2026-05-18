// ─── FeatureGrid ──────────────────────────────────────────────────────────────
// Visual showcase of features on the landing page.
// Server component — no interactivity needed here.

const features = [
  {
    icon: "🎤",
    title: "Top Artists",
    description: "See who you've been listening to across 4 weeks, 6 months, and all time.",
  },
  {
    icon: "🎵",
    title: "Top Tracks",
    description: "Your most-played songs ranked with streaming counts and popularity scores.",
  },
  {
    icon: "🏷️",
    title: "Genre DNA",
    description: "Visualize your taste as a genre breakdown — discover your musical identity.",
  },
  {
    icon: "🗺️",
    title: "Listening Heatmap",
    description: "When do you listen most? Hour-by-hour and day-by-day patterns revealed.",
  },
  {
    icon: "🧠",
    title: "Mood Analysis",
    description: "Your music's energy, danceability, and valence profiled into a personality.",
  },
  {
    icon: "🃏",
    title: "Share Your Card",
    description: "Generate a beautiful music personality card to share with friends.",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="group rounded-2xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#1DB954]/20 hover:bg-white/[0.05]"
        >
          <div className="mb-3 text-2xl">{feature.icon}</div>
          <h3 className="mb-1 font-semibold text-white">{feature.title}</h3>
          <p className="text-sm leading-relaxed text-white/50">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
