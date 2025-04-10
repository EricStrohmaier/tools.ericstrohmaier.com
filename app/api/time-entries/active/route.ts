import { NextRequest } from "next/server";
import { getTimeEntries, getUser } from "@/app/actions";
import { withCors, corsResponse } from "@/app/api/cors-middleware";

// Export a CORS-wrapped GET handler
export const GET = withCors(async (request: NextRequest) => {
  try {
    const user = await getUser();

    if (!user) {
      return corsResponse({ error: "Unauthorized" }, 401);
    }

    // Get all time entries and find the active one (no end_time)
    const timeEntries = await getTimeEntries();
    const activeTimeEntry = timeEntries.find(entry => !entry.end_time);

    if (!activeTimeEntry) {
      return corsResponse(null, 200);
    }

    return corsResponse(activeTimeEntry, 200);
  } catch (error) {
    console.error("Error getting active time entry:", error);
    return corsResponse({ error: "Internal server error" }, 500);
  }
});
