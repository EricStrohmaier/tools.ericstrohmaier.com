import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("ping");

  const body = await request.json();

  console.log("Received:", body);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
