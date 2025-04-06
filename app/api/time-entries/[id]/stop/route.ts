import { NextResponse } from "next/server";
import { getUser, stopTimeTracking } from "@/app/actions";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: "Time entry ID is required" }, { status: 400 });
    }
    
    const result = await stopTimeTracking(id);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error stopping time entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
