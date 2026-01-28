"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchInput } from "@/components/shared/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Category, Tag } from "@/lib/db/types";

export function SearchFilterBar({
  search,
  categories,
  tags,
  selectedCategory,
  selectedDifficulty,
  selectedTag,
  teacherFriendly,
}: {
  search: string;
  categories: Category[];
  tags: Tag[];
  selectedCategory: string;
  selectedDifficulty: string;
  selectedTag: string;
  teacherFriendly: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(search ?? "");
  const [category, setCategory] = useState(selectedCategory ?? "");
  const [difficulty, setDifficulty] = useState(selectedDifficulty ?? "");
  const [tag, setTag] = useState(selectedTag ?? "");
  const [teacher, setTeacher] = useState(teacherFriendly ?? false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (query) {
        next.set("search", query);
      } else {
        next.delete("search");
      }
      if (category) {
        next.set("category", category);
      } else {
        next.delete("category");
      }
      if (difficulty) {
        next.set("difficulty", difficulty);
      } else {
        next.delete("difficulty");
      }
      if (tag) {
        next.set("tag", tag);
      } else {
        next.delete("tag");
      }
      if (teacher) {
        next.set("teacher", "true");
      } else {
        next.delete("teacher");
      }
      router.replace(`/products?${next.toString()}`);
    }, 350);
    return () => clearTimeout(timeout);
  }, [query, category, difficulty, tag, teacher, router, params]);

  const difficultyOptions = useMemo(
    () => ["Beginner", "Intermediate", "Advanced"],
    []
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="min-w-[220px] flex-1">
        <SearchInput value={query} onChange={setQuery} placeholder="Search products" />
      </div>
      <Select value={category || "all"} onValueChange={(value) => setCategory(value === "all" ? "" : value)}>
        <SelectTrigger className="min-w-[160px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={difficulty || "all"} onValueChange={(value) => setDifficulty(value === "all" ? "" : value)}>
        <SelectTrigger className="min-w-[150px]">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All difficulty</SelectItem>
          {difficultyOptions.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={tag || "all"} onValueChange={(value) => setTag(value === "all" ? "" : value)}>
        <SelectTrigger className="min-w-[150px]">
          <SelectValue placeholder="Tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All tags</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.id} value={tag.id}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant={teacher ? "default" : "outline"}
        onClick={() => setTeacher((prev) => !prev)}
        className="h-10"
      >
        Teacher Friendly
      </Button>
    </div>
  );
}
