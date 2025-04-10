import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  // Add debugging headers to track request path
  req.headers.set("x-pathname", req.nextUrl.pathname);
  req.headers.set("x-url", req.url);

  // For all routes, just update the session normally without special handling
  return await updateSession(req);
}
}
