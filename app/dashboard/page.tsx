import { redirect } from "next/navigation";
import { getUser } from "../actions";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { token?: string; session_id?: string };
}) {
  const user = await getUser();

  if (!user) redirect("/signin");

  return <div className="h-screen"></div>;
}
