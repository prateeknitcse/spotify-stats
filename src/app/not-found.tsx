import Link from "next/link";
import { Music, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Music className="h-8 w-8 text-primary" />
      </div>
      <div>
        <p className="text-6xl font-black text-primary">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          This track doesn&apos;t exist in your library.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
