import { NextRequest } from "next/server";
import { getUser, getTimeEntry, updateTimeEntry, deleteTimeEntry } from "@/app/actions";

// GET /api/time-entries/:id - Get a specific time entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const timeEntryId = params.id;
    const timeEntry = await getTimeEntry(timeEntryId);

    if (!timeEntry) {
      return new Response(JSON.stringify({ error: "Time entry not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Check if the time entry belongs to the user
    if (timeEntry.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(timeEntry), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching time entry:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

// PUT /api/time-entries/:id - Update a time entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const timeEntryId = params.id;
    const body = await request.json();

    // First, check if the time entry exists and belongs to the user
    const timeEntry = await getTimeEntry(timeEntryId);

    if (!timeEntry) {
      return new Response(JSON.stringify({ error: "Time entry not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (timeEntry.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Calculate duration if start_time and end_time are provided
    let duration = timeEntry.duration;
    if (body.start_time && body.end_time) {
      const startTime = new Date(body.start_time);
      const endTime = new Date(body.end_time);
      duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    }

    // Update the time entry
    const result = await updateTimeEntry(timeEntryId, {
      project_id: body.project_id,
      description: body.description,
      start_time: body.start_time,
      end_time: body.end_time,
      duration: duration,
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
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating time entry:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

// DELETE /api/time-entries/:id - Delete a time entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const timeEntryId = params.id;

    // First, check if the time entry exists and belongs to the user
    const timeEntry = await getTimeEntry(timeEntryId);

    if (!timeEntry) {
      return new Response(JSON.stringify({ error: "Time entry not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (timeEntry.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Delete the time entry
    const result = await deleteTimeEntry(timeEntryId);

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Time entry deleted successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error deleting time entry:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
