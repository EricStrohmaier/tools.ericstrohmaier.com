import { redirect } from "next/navigation";
import { getUser, getProjects } from "../actions";
import { DashboardClient } from "@/components/app/DashboardClient";
import { ExtensionAuthHandler } from "@/components/Authentication/ExtensionAuthHandler";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { token?: string; session_id?: string; extension?: string };
}) {
  const user = await getUser();

  if (!user) redirect("/signin");

  // Check if this is an extension authentication request
  const isExtensionAuth = searchParams.extension === "true";

  // Get the session for extension auth if needed
  let session = null;
  if (isExtensionAuth) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    session = data.session;
  }

  // Pre-fetch projects for the dashboard
  const projects = await getProjects();

  return (
    <div className="w-full max-w-7xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Extension Auth Handler - will only show and activate if extension param is present */}
      {isExtensionAuth && user && session && (
        <ExtensionAuthHandler user={user} session={session} />
      )}

      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-semibold mb-2">Time Tracking Tool</h1>
        <p className="text-sm text-gray-600">
          Manage your projects and track your time. Without the other BS.
        </p>
      </div>

      <DashboardClient initialProjects={projects} />
    </div>
  );
}
