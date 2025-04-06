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
  req.headers.set("x-pathname", req.nextUrl.pathname);
  req.headers.set("x-url", req.url);
  
  // Check if this is a signin request from the extension
  const url = new URL(req.url);
  const isExtensionAuth = url.pathname === "/signin" && url.searchParams.get("extension") === "true";
  
  if (isExtensionAuth) {
    // Check if the user is already logged in
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll() {
            // We don't need to set cookies in this check
          },
        },
      }
    );
    
    const { data: { session } } = await supabase.auth.getSession();
    
    // If user is already logged in, redirect to extension success page
    if (session) {
      const redirectUrl = new URL("/extension-auth-success", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  return await updateSession(req);
}
