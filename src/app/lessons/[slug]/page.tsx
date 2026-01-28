import { notFound } from "next/navigation";
import { lessonRepository } from "@/lib/db";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await lessonRepository.getBySlug(slug);
  if (!lesson) return notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Lessons", href: "/lessons" },
          { label: lesson.title },
        ]}
      />
      <div className="mt-6 space-y-4">
        <h1 className="text-4xl font-semibold">{lesson.title}</h1>
        <p className="text-lg text-muted-foreground">{lesson.summary}</p>
        <div className="grid gap-2 text-sm text-muted-foreground">
          {lesson.duration_minutes ? (
            <p>Duration: {lesson.duration_minutes} minutes</p>
          ) : null}
          {lesson.learning_goals_json?.length ? (
            <p>Learning goals: {lesson.learning_goals_json.join(", ")}</p>
          ) : null}
          {lesson.prerequisites_json?.length ? (
            <p>Prerequisites: {lesson.prerequisites_json.join(", ")}</p>
          ) : null}
        </div>
        <MarkdownRenderer content={lesson.content_md} />
      </div>
    </div>
  );
}
