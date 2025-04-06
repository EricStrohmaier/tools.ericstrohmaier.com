import { createClient } from "@/utils/supabase/server";

export async function GET() {

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  try {
    if (!session) {
      return new Response(JSON.stringify({ success: false }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ session }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error validating auth:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
