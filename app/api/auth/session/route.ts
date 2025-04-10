import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { withCors, corsResponse } from "@/app/api/cors-middleware";

// Export a CORS-wrapped GET handler
export const GET = withCors(async (request: NextRequest) => {
  console.log("Session API called with headers:", JSON.stringify(Object.fromEntries([...request.headers])));
  console.log("Session API called with URL:", request.url);

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  try {
    if (!session) {
      console.log("No session found, returning 401");
      return corsResponse({ success: false }, 401);
    }

    console.log("Session found, returning 200"); return corsResponse({
      session,
      user: session.user
    }, 200);
  } catch (error) {
    console.error("Error validating auth:", error);
    return corsResponse({ error: "Internal server error" }, 500);
  }
});
