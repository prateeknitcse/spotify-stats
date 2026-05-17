// Landing page — will be replaced in Module 02 (Auth)
// For now: simple placeholder to confirm the stack works.

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Spotify green dot indicator */}
        <div className="h-3 w-3 rounded-full bg-[#1DB954] shadow-[0_0_12px_#1DB954]" />

        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Spotify Stats
        </h1>

        <p className="max-w-md text-muted-foreground">
          Your music, beautifully visualized. Connect your Spotify account to
          see your top artists, tracks, genres, and listening patterns.
        </p>

        <p className="mt-4 rounded-lg border border-border bg-surface px-4 py-2 font-mono text-sm text-muted-foreground">
          ✅ Stack initialized — Auth module coming next
        </p>
      </div>
    </main>
  );
}
