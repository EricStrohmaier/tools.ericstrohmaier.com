"use client";

import { Button } from "@/components/ui/button";
import { BlobProvider } from "@react-pdf/renderer";
import { FileText } from "lucide-react";
import { TimeEntry, Project } from "@/app/actions";
import { DateRange } from "react-day-picker";
import TimeTrackingPDF from "./TimeTrackingPDF";

interface TimeTrackingPDFButtonProps {
  timeEntries: TimeEntry[];
  projects: Record<string, Project>;
  dateRange: DateRange | undefined;
  projectName?: string;
  userName?: string;
  disabled?: boolean;
}

export function TimeTrackingPDFButton({
  timeEntries,
  projects,
  dateRange,
  projectName,
  userName,
  disabled = false,
}: TimeTrackingPDFButtonProps) {
  const generateFileName = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const projectStr = projectName ? `-${projectName.replace(/\s+/g, "-")}` : "";
    return `time-report${projectStr}-${dateStr}.pdf`;
  };

  return (
    <BlobProvider
      document={
        <TimeTrackingPDF
          timeEntries={timeEntries}
          projects={projects}
          dateRange={dateRange}
          projectName={projectName}
          userName={userName}
        />
      }
    >
      {({ url, loading, error }) => (
        <Button
          variant="outline"
          disabled={disabled || loading || timeEntries.length === 0 || !!error}
          onClick={() => {
            if (url) {
              const link = window.document.createElement("a");
              link.href = url;
              link.download = generateFileName();
              link.click();
            }
          }}
        >
          <FileText className="mr-2 h-4 w-4" />
          {loading ? "Generating..." : "Export PDF"}
        </Button>
      )}
    </BlobProvider>
  );
}
