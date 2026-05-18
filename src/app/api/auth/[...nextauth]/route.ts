import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Next.js App Router requires named exports for HTTP methods.
// NextAuth handles GET (redirects) and POST (callbacks) for us.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
