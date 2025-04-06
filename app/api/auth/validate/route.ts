import { NextResponse } from "next/server";
import { getUser } from "@/app/actions";

export async function GET() {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error validating auth:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
