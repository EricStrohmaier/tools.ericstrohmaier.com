import { redirect } from "next/navigation";
import { getUser, getProjects } from "../../actions";
import { DashboardClient } from "@/components/app/DashboardClient";

export default async function ProjectsPage() {
  const user = await getUser();

  if (!user) redirect("/signin");

  // Pre-fetch projects for the dashboard
  const projects = await getProjects();

  return (
    <div className="w-full max-w-7xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-semibold mb-2">Time Tracking Tool</h1>
        <p className="text-sm text-gray-600">
          Manage your projects and track your time. Without the other BS.
        </p>
      </div>

      <DashboardClient initialProjects={projects} activeTab="projects" />
    </div>
  );
}
