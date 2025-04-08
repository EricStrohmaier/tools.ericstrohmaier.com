"use client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import BlobProvider to ensure it only loads on the client
const DynamicBlobProvider = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.BlobProvider),
  { ssr: false }
);

interface PDFDownloadButtonProps {
  document: React.ReactElement;
  fileName: string;
}

export function PDFDownloadButton({
  document,
  fileName,
}: PDFDownloadButtonProps) {
  return (
    <DynamicBlobProvider document={document}>
      {({ url, loading }) => (
        <Button
          variant="outline"
          disabled={loading}
          onClick={() => {
            if (url) {
              const link = window.document.createElement("a");
              link.href = url;
              link.download = fileName;
              link.click();
            }
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          {loading ? "Preparing Download..." : "Export PDF"}
        </Button>
      )}
    </DynamicBlobProvider>
  );
}
