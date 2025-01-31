"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/invoice";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled>
        Preparing Download...
      </Button>
    ),
  }
);

interface PDFDownloadButtonProps {
  document: React.ReactElement;
  fileName: string;
}

export function PDFDownloadButton({ document, fileName }: PDFDownloadButtonProps) {
  return (
    <PDFDownloadLink document={document} fileName={fileName}>
      {({ loading }) => (
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={loading}
        >
          {loading ? "Preparing Download..." : "Download PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
