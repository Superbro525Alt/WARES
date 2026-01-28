import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { DownloadPdf } from "@/lib/db/types";

export function PdfViewer({ pdf }: { pdf: DownloadPdf }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
        <div>
          <p className="text-sm font-semibold">{pdf.title}</p>
          {pdf.description ? (
            <p className="text-xs text-muted-foreground">{pdf.description}</p>
          ) : null}
        </div>
        <Button asChild size="sm" variant="outline">
          <a href={pdf.storage_path} target="_blank" rel="noreferrer">
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      </div>
      <div className="h-[480px]">
        <iframe
          src={pdf.storage_path}
          title={pdf.title}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
