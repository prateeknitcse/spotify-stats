// ─── Environment Variable Validation ─────────────────────────────────────────
// Validates required env vars at startup.
// Import this in auth.ts so the app fails fast with a clear message
// instead of a cryptic "Authentication failed" on the login page.

const required = [
  "SPOTIFY_CLIENT_ID",
  "SPOTIFY_CLIENT_SECRET",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
] as const;

export function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `[Config] Missing required environment variables:\n${missing.map((k) => `  ❌ ${k}`).join("\n")}\n\nCopy .env.example to .env.local and fill in the values.`
    );
  }
}

// Run validation immediately when this module is imported
validateEnv();
