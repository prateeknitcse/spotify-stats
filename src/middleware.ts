import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// ─── Route Protection Middleware ──────────────────────────────────────────────
// Runs at the edge BEFORE any page renders.
// Unauthenticated users hitting /dashboard/* are redirected to "/" instantly.
// No flash of protected content — the redirect happens server-side.

export default withAuth(
  function middleware(req) {
    // If user has a token refresh error, force re-login
    const token = req.nextauth.token;

    if (token?.error === "RefreshAccessTokenError") {
      const loginUrl = new URL("/", req.url);
      loginUrl.searchParams.set("error", "session_expired");
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true if user is allowed to access the route
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/",
    },
  }
);

// ─── Matcher Config ───────────────────────────────────────────────────────────
// Only run middleware on dashboard routes.
// Excludes: API routes, static files, Next.js internals, landing page.

export const config = {
  matcher: [
    "/dashboard/:path*",
    // Add more protected routes here as we build them:
    // "/profile/:path*",
  ],
};
