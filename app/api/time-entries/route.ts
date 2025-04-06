import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser, createTimeEntry } from "@/app/actions";

// GET /api/time-entries - Get time entries for the authenticated user
export async function GET(request: NextRequest) {
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

    // Get query parameters
    const url = new URL(request.url);
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");
    const projectId = url.searchParams.get("project_id");

    // Build the query
    let query = supabase
      .from("time_entries")
      .select(`
        *,
        projects (
          id,
          name,
          client,
          hourly_rate
        )
      `)
      .eq("user_id", user.id)
      .order("start_time", { ascending: false });

    // Add filters if provided
    if (startDate) {
      query = query.gte("start_time", startDate);
    }

    if (endDate) {
      query = query.lte("start_time", endDate);
    }

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const { data: timeEntries, error } = await query;

    if (error) {
      console.error("Error fetching time entries:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch time entries" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(timeEntries), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in time entries API:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

// POST /api/time-entries - Create a new time entry
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
    if (!body.start_time) {
      return new Response(JSON.stringify({ error: "Start time is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Calculate duration if end_time is provided
    let duration = null;
    if (body.end_time) {
      const startTime = new Date(body.start_time);
      const endTime = new Date(body.end_time);
      duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    }

    const result = await createTimeEntry({
      project_id: body.project_id || "",
      description: body.description || "",
      start_time: body.start_time,
      end_time: body.end_time || null,
      duration: duration ?? undefined,
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
    console.error("Error creating time entry:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
