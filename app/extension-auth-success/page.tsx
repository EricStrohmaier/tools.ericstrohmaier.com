import { createClient } from "@/utils/supabase/server";
import ExtensionAuthSuccess from "./ExtensionAuthSuccess";

// Main page component (Server Component)
export default async function ExtensionAuthSuccessPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const sessionData = {
    session,
    user: session?.user,
  };

  // Pass the session data to the client component
  return <ExtensionAuthSuccess sessionData={sessionData} />;
}
