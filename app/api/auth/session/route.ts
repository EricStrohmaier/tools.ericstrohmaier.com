import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { corsMiddleware } from "@/app/api/cors";

export async function OPTIONS(request: NextRequest) {
  return corsMiddleware(request);
}

export async function GET(request: NextRequest) {
  // Handle preflight OPTIONS request via the OPTIONS function
  if (request.method === 'OPTIONS') {
    return corsMiddleware(request);
  }
  
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  try {
    // Get the origin from the request headers
    const origin = request.headers.get('origin') || '*';
    
    // Common headers for all responses
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    };
    
    if (!session) {
      return new Response(JSON.stringify({ success: false }), {
        status: 401,
        headers,
      });
    }

    return new Response(JSON.stringify({ session }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error validating auth:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": request.headers.get('origin') || '*',
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }
}
