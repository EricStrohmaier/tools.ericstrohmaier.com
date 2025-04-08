import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser, createProject } from "@/app/actions";
import { corsMiddleware } from "@/app/api/cors";

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return corsMiddleware(request);
}

// GET /api/projects - Get all projects for the authenticated user
export async function GET(request: NextRequest) {
  // Handle preflight OPTIONS request via the OPTIONS function
  if (request.method === 'OPTIONS') {
    return corsMiddleware(request);
  }
  try {
    const user = await getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const supabase = createClient();

    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      // Get the origin from the request headers
      const origin = request.headers.get('origin') || '*';
      
      return new Response(JSON.stringify({ error: "Failed to fetch projects" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
        },
      });
    }

    // Get the origin from the request headers
    const origin = request.headers.get('origin') || '*';
    
    return new Response(JSON.stringify(projects), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  } catch (error) {
    console.error("Error in projects API:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return new Response(JSON.stringify({ error: "Project name is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const result = await createProject({
      name: body.name,
      description: body.description || "",
      client: body.client || "",
      hourly_rate: body.hourly_rate || 0,
      is_active: true,
    });

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(result.data), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
