"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "intended-use", label: "Intended Use" },
  { id: "quickstart", label: "Quickstart" },
  { id: "guides", label: "Guides" },
  { id: "lessons", label: "Lessons" },
  { id: "practice", label: "Good / Bad Practice" },
  { id: "faqs", label: "FAQs" },
  { id: "media", label: "Media" },
  { id: "downloads", label: "Downloads" },
  { id: "cad", label: "CAD" },
];

export function ProductSectionNavMobile() {
  return (
    <Accordion type="single" collapsible className="rounded-xl border border-border/60 bg-muted/20">
      <AccordionItem value="sections">
        <AccordionTrigger className="px-4">Jump to section</AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="grid gap-2 text-sm">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="text-muted-foreground hover:text-foreground">
                {section.label}
              </a>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
