"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchInput } from "@/components/shared/search-input";

export function ResourceIndex({
  items,
  basePath,
}: {
  items: { id: string; title: string; summary?: string | null; slug: string }[];
  basePath: string;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter((item) =>
      `${item.title} ${item.summary ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [items, query]);

  return (
    <div className="space-y-6">
      <SearchInput value={query} onChange={setQuery} placeholder="Search" />
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <Link
            key={item.id}
            href={`${basePath}/${item.slug}`}
            className="rounded-2xl border border-border/60 bg-muted/30 p-4"
          >
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
