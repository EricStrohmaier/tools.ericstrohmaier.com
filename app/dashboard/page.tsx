import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Redirect to the projects tab by default
  redirect("/dashboard/projects");
}
