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
  
  // Handle CORS for API routes
  const url = new URL(req.url);
  const isApiRoute = url.pathname.startsWith('/api/');
  
  // For API requests, handle CORS
  if (isApiRoute) {
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    // For actual API requests, continue to the API route but add CORS headers
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
  
  // Check if this is a signin request from the extension
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
