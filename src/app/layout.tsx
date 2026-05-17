import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Spotify Stats — Your Music, Visualized",
    template: "%s | Spotify Stats",
  },
  description:
    "Discover your top artists, tracks, genres, and listening patterns. A beautiful Spotify analytics dashboard.",
  keywords: [
    "spotify",
    "stats",
    "music",
    "analytics",
    "top tracks",
    "top artists",
    "listening history",
    "genre analytics",
  ],
  authors: [{ name: "Spotify Stats" }],
  openGraph: {
    type: "website",
    title: "Spotify Stats",
    description: "Your music, beautifully visualized.",
    siteName: "Spotify Stats",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spotify Stats",
    description: "Your music, beautifully visualized.",
  },
  robots: {
    index: false, // Don't index — this is a personal dashboard
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning // Required by next-themes
    >
      <body className="min-h-screen font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
