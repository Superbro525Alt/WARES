"use client";

import { useMemo } from "react";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function MarkdownEditor({
  value,
  onChange,
  label,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}) {
  const preview = useMemo(() => value ?? "", [value]);

  return (
    <div className={cn("grid gap-3", className)}>
      {label ? <p className="text-sm font-medium">{label}</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[280px] font-mono text-sm"
        />
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
          <MarkdownRenderer content={preview} className="prose-sm" />
        </div>
      </div>
    </div>
  );
}
