import { notFound } from "next/navigation";
import { guideRepository } from "@/lib/db";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await guideRepository.getBySlug(slug);
  if (!guide) return notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: guide.title },
        ]}
      />
      <div className="mt-6 space-y-4">
        <h1 className="text-4xl font-semibold">{guide.title}</h1>
        <p className="text-lg text-muted-foreground">{guide.summary}</p>
        <MarkdownRenderer content={guide.content_md} />
      </div>
    </div>
  );
}
