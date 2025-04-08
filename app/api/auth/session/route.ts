import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { withCors, corsResponse } from "@/app/api/cors-middleware";

// Export a CORS-wrapped GET handler
export const GET = withCors(async (request: NextRequest) => {
  
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  try {
    if (!session) {
      return corsResponse({ success: false }, 401);
    }

    return corsResponse({ session }, 200);
  } catch (error) {
    console.error("Error validating auth:", error);
    return corsResponse({ error: "Internal server error" }, 500);
  }
});
