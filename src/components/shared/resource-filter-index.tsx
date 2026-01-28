"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchInput } from "@/components/shared/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ResourceFilterIndex({
  items,
  basePath,
  showDuration,
  showDifficulty = true,
}: {
  items: {
    id: string;
    title: string;
    summary?: string | null;
    slug: string;
    difficulty?: string | null;
    minutes?: number | null;
  }[];
  basePath: string;
  showDuration?: boolean;
  showDifficulty?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [time, setTime] = useState("");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        !query ||
        `${item.title} ${item.summary ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesDifficulty =
        !showDifficulty || !difficulty || item.difficulty === difficulty;
      const matchesTime = !time || (item.minutes ?? 0) <= Number(time);
      return matchesQuery && matchesDifficulty && matchesTime;
    });
  }, [items, query, difficulty, time, showDifficulty]);

  return (
    <div className="space-y-6">
      <div
        className={`grid gap-3 ${showDifficulty ? "md:grid-cols-3" : "md:grid-cols-2"}`}
      >
        <SearchInput value={query} onChange={setQuery} placeholder="Search" />
        {showDifficulty ? (
          <Select
            value={difficulty || "all"}
            onValueChange={(value) =>
              setDifficulty(value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All difficulty</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        ) : null}
        <Select
          value={time || "all"}
          onValueChange={(value) => setTime(value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={showDuration ? "Duration" : "Time"} />
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
            href={`${basePath}/${item.slug}`}
            className="rounded-2xl border border-border/60 bg-muted/30 p-4"
          >
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.summary}</p>
            <div className="mt-2 text-xs text-muted-foreground">
              {item.difficulty ? `${item.difficulty} • ` : ""}
              {item.minutes ? `${item.minutes} min` : ""}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
