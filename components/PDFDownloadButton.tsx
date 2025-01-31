"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { BlobProvider } from "@react-pdf/renderer";

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
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
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
          {loading ? "Preparing Download..." : "Download PDF"}
        </Button>
      )}
    </BlobProvider>
  );
}
