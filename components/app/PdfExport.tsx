"use client";

import { TimeEntry, Project } from "@/app/actions";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useState } from "react";

interface PdfExportProps {
  timeEntries: TimeEntry[];
  projects: Record<string, Project>;
  dateRange: DateRange | undefined;
  projectName?: string;
  userName?: string;
}

export async function generatePdf({
  timeEntries,
  projects,
  dateRange,
  projectName,
  userName,
}: PdfExportProps) {
  try {
    // Dynamically import jsPDF and jspdf-autotable
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default;
    
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Dynamically import jspdf-autotable
    await import('jspdf-autotable').then(() => {
      // Add title
      doc.setFontSize(20);
      doc.text("Time Tracking Report", 14, 22);
      
      // Add report metadata
      doc.setFontSize(12);
      doc.text(`Generated on: ${format(new Date(), "MMMM dd, yyyy")}`, 14, 32);
      
      if (userName) {
        doc.text(`User: ${userName}`, 14, 38);
      }
      
      // Add date range
      if (dateRange?.from) {
        const dateText = dateRange.to
          ? `Date Range: ${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`
          : `Date: ${format(dateRange.from, "MMM dd, yyyy")}`;
        doc.text(dateText, 14, 44);
      }
      
      // Add project filter if specified
      if (projectName) {
        doc.text(`Project: ${projectName}`, 14, 50);
      }
      
      // Calculate total hours
      const totalSeconds = timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0);
      const totalHours = (totalSeconds / 3600).toFixed(2);
      doc.text(`Total Hours: ${totalHours}`, 14, 56);
      
      // Format data for the table
      const tableData = timeEntries.map(entry => {
        const project = projects[entry.project_id];
        const startDate = format(new Date(entry.start_time), "MMM dd, yyyy");
        const hours = entry.duration ? (entry.duration / 3600).toFixed(2) : "0.00";
        
        return [
          project?.name || "Unknown Project",
          entry.description || "No description",
          startDate,
          `${hours} hrs`,
        ];
      });
      
      // Apply the autoTable function
      // @ts-ignore - autoTable is added by the plugin import
      doc.autoTable({
        startY: 65,
        head: [["Project", "Description", "Date", "Duration"]],
        body: tableData,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        margin: { top: 65 },
      });
      
      // Add footer with page numbers
      // @ts-ignore - internal is available on jsPDF instances
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Page ${i} of ${pageCount}`,
          // @ts-ignore - internal is available on jsPDF instances
          doc.internal.pageSize.width / 2,
          // @ts-ignore - internal is available on jsPDF instances
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }
      
      // Generate filename
      const dateStr = format(new Date(), "yyyy-MM-dd");
      const projectStr = projectName ? `-${projectName.replace(/\s+/g, "-")}` : "";
      const filename = `time-report${projectStr}-${dateStr}.pdf`;
      
      // Save the PDF
      doc.save(filename);
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. See console for details.');
  }
}

export function PdfExportButton({
  timeEntries,
  projects,
  dateRange,
  projectName,
  userName,
  disabled = false,
}: PdfExportProps & { disabled?: boolean }) {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await generatePdf({
        timeEntries,
        projects,
        dateRange,
        projectName,
        userName,
      });
    } catch (error) {
      console.error('Error in PDF export:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={disabled || timeEntries.length === 0 || isExporting}
    >
      <FileText className="mr-2 h-4 w-4" />
      {isExporting ? 'Generating...' : 'Export PDF'}
    </Button>
  );
}
