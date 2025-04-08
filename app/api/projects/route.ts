import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser, createProject } from "@/app/actions";
import { withCors, corsResponse } from "@/app/api/cors-middleware";

// GET /api/projects - Get all projects for the authenticated user
export const GET = withCors(async (request: NextRequest) => {
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
      return corsResponse({ error: "Failed to fetch projects" }, 500);
    }

    return corsResponse(projects, 200);
  } catch (error) {
    console.error("Error in projects API:", error);
    return corsResponse({ error: "Internal server error" }, 500);
  }
});

// POST /api/projects - Create a new project
export const POST = withCors(async (request: NextRequest) => {
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
      return corsResponse({ error: "Project name is required" }, 400);
    }

    const result = await createProject({
      name: body.name,
      description: body.description || "",
      client: body.client || "",
      hourly_rate: body.hourly_rate || 0,
      is_active: true,
    });

    if (result.error) {
      return corsResponse({ error: result.error }, 400);
    }

    return corsResponse(result.data, 201);
  } catch (error) {
    console.error("Error creating project:", error);
    return corsResponse({ error: "Internal server error" }, 500);
  }
});
