"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { BlobProvider } from "@react-pdf/renderer";
import { Download } from "lucide-react";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <Button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        disabled
      >
        Preparing Download...
      </Button>
    ),
  }
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
