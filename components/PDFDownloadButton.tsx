"use client";
import { Button } from "@/components/ui/button";
import { BlobProvider } from "@react-pdf/renderer";
import { Download } from "lucide-react";

interface PDFDownloadButtonProps {
  document: React.ReactElement;
  fileName: string;
}

export function PDFDownloadButton({
  document,
  fileName,
}: PDFDownloadButtonProps) {
  return (
    <BlobProvider document={document}>
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
    </BlobProvider>
  );
}
