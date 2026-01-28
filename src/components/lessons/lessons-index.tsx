"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchInput } from "@/components/shared/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LessonsIndex({
  items,
}: {
  items: {
    id: string;
    title: string;
    summary?: string | null;
    slug: string;
    minutes?: number | null;
    learningGoals?: string[] | null;
  }[];
}) {
  const [query, setQuery] = useState("");
  const [time, setTime] = useState("");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        !query ||
        `${item.title} ${item.summary ?? ""} ${(item.learningGoals ?? []).join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesTime = !time || (item.minutes ?? 0) <= Number(time);
      return matchesQuery && matchesTime;
    });
  }, [items, query, time]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2">
        <SearchInput value={query} onChange={setQuery} placeholder="Search lessons" />
        <Select value={time || "all"} onValueChange={(value) => setTime(value === "all" ? "" : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any duration</SelectItem>
            <SelectItem value="30">Up to 30 min</SelectItem>
            <SelectItem value="60">Up to 60 min</SelectItem>
            <SelectItem value="90">Up to 90 min</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <Link
            key={item.id}
            href={`/lessons/${item.slug}`}
            className="rounded-2xl border border-border/60 bg-muted/30 p-4"
          >
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.summary}</p>
            {item.learningGoals?.length ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Learning goals: {item.learningGoals.slice(0, 3).join(", ")}
              </p>
            ) : null}
            <div className="mt-2 text-xs text-muted-foreground">
              {item.minutes ? `${item.minutes} min` : ""}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
