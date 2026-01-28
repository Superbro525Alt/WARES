"use client";

import { useMemo, useState } from "react";
import { SearchInput } from "@/components/shared/search-input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import type { Faq } from "@/lib/db/types";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query) return faqs;
    return faqs.filter((faq) =>
      faq.question.toLowerCase().includes(query.toLowerCase())
    );
  }, [faqs, query]);

  return (
    <div className="space-y-4">
      <SearchInput value={query} onChange={setQuery} placeholder="Search FAQs" />
      <Accordion type="single" collapsible className="w-full">
        {filtered.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              <MarkdownRenderer content={faq.answer_md} className="prose-sm" />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
