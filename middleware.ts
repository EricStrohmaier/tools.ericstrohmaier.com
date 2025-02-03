import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

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
  req.headers.set("x-pathname", req.nextUrl.pathname);
  req.headers.set("x-url", req.url);
  return await updateSession(req);
}
