import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser, stopTimeTracking } from "@/app/actions";

// POST /api/time-entries/stop - Stop the currently active time entry
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

    // Find the active time entry
    const supabase = createClient();
    const { data: activeEntries, error: fetchError } = await supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", user.id)
      .is("end_time", null)
      .order("start_time", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Error fetching active time entry:", fetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch active time entry" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!activeEntries || activeEntries.length === 0) {
      return new Response(JSON.stringify({ error: "No active time entry found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const activeTimeEntry = activeEntries[0];

    // Stop the time entry
    const result = await stopTimeTracking(activeTimeEntry.id);

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error stopping time entry:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
