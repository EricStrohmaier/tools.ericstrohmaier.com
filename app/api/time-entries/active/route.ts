import { NextResponse } from "next/server";
import { getTimeEntries, getUser } from "@/app/actions";

export async function GET() {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get all time entries and find the active one (no end_time)
    const timeEntries = await getTimeEntries();
    const activeTimeEntry = timeEntries.find(entry => !entry.end_time);
    
    if (!activeTimeEntry) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(activeTimeEntry);
  } catch (error) {
    console.error("Error getting active time entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
