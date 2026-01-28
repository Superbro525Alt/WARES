"use client";

import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

export type ActivityItem = {
  id: string;
  label: string;
  timestamp: string;
  meta?: string;
};

export function ActivityLog({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-semibold">Recent activity</h2>
      </div>
      <div className="mt-4 space-y-3 text-sm">
        {items.length === 0 ? (
          <p className="text-muted-foreground">No recent activity yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border/60 bg-muted/30 p-3">
              <p className="font-semibold">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.timestamp}</p>
              {item.meta ? <p className="text-xs text-muted-foreground">{item.meta}</p> : null}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
