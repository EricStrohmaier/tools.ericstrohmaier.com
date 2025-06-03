"use client";

import { useEffect } from "react";
import { WeekView } from "@/components/week-view";
import { useRouter } from "next/navigation";

export default function WeekPage() {
  const router = useRouter();
  
  // Force full week view by redirecting to the week page
  useEffect(() => {
    // This effect ensures we're showing the full week view
    // We could add additional logic here if needed
  }, []);
  
  return <WeekView initialShowFullWeek={true} />;
}
