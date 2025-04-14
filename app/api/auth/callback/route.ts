import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const isExtension = searchParams.get("extension") === "true";
  console.log("next", next, origin, "isExtension:", isExtension, "code:", code);

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.log(error && "Exchange code for session error:" + error.message);

    if (!error) {
      // Redirect to the next parameter or extension success page
      const redirectPath = isExtension ? "/extension-auth-success" : next;

      if (redirectPath.startsWith("https://")) {
        return NextResponse.redirect(redirectPath);
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  // Handle error case
  const errorPath = isExtension ? "/extension-auth-error" : "/auth/auth-code-error";
  return NextResponse.redirect(`${origin}${errorPath}`);
}
