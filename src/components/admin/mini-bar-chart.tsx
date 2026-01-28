"use client";

import { useMemo } from "react";

export function MiniBarChart({
  data,
  labels,
}: {
  data: number[];
  labels: string[];
}) {
  const max = Math.max(...data, 1);
  const bars = useMemo(() => data.map((value) => Math.max(6, (value / max) * 100)), [data, max]);

  return (
    <div className="grid gap-2">
      <div className="flex h-24 items-end gap-2">
        {bars.map((height, index) => (
          <div key={index} className="flex-1">
            <div
              className="rounded-md bg-primary/80"
              style={{ height: `${height}%` }}
              title={`${labels[index]}: ${data[index]}`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
