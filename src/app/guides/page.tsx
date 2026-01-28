import { guideRepository } from "@/lib/db";
import { SectionHeading } from "@/components/shared/section-heading";
import { ResourceFilterIndex } from "@/components/shared/resource-filter-index";

export default async function GuidesPage() {
  const guides = await guideRepository.list({ publishedOnly: true });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14">
      <SectionHeading
        eyebrow="Guides"
        title="Step-by-step documentation"
        description="Product-specific and global guides for teachers and teams."
      />
      <div className="mt-8">
        <ResourceFilterIndex
          items={guides.map((guide) => ({
            id: guide.id,
            title: guide.title,
            summary: guide.summary,
            slug: guide.slug,
            difficulty: guide.difficulty ?? undefined,
            minutes: guide.est_minutes ?? undefined,
          }))}
          basePath="/guides"
        />
      </div>
    </div>
  );
}
