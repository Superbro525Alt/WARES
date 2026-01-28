"use client";

import { useTeacherMode } from "@/lib/stores/teacher-mode";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

export function ProductSectionNav() {
  const { enabled, toggle } = useTeacherMode();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Teacher Friendly Mode</p>
            <p className="text-xs text-muted-foreground">
              Highlight quickstarts, lessons, and common mistakes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={enabled} onCheckedChange={toggle} id="teacher-mode" />
            <Label htmlFor="teacher-mode" className="text-xs">
              {enabled ? "On" : "Off"}
            </Label>
          </div>
        </div>
      </div>
      <nav className="space-y-2 text-sm">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="block rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          >
            {section.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
