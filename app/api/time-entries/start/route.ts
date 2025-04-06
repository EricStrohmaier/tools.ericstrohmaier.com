import { NextResponse } from "next/server";
import { getUser, startTimeTracking } from "@/app/actions";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { project_id, description, tags } = await request.json();
    
    if (!project_id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }
    
    const result = await startTimeTracking(project_id, description, tags);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error starting time entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
