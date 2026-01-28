import { lessonRepository } from "@/lib/db";
import { SectionHeading } from "@/components/shared/section-heading";
import { LessonsIndex } from "@/components/lessons/lessons-index";

export default async function LessonsPage() {
  const lessons = await lessonRepository.list({ publishedOnly: true });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14">
      <SectionHeading
        eyebrow="Lessons"
        title="Classroom-ready lesson plans"
        description="Lesson plans with learning goals, prerequisites, and timing."
      />
      <div className="mt-8">
        <LessonsIndex
          items={lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            summary: lesson.summary,
            slug: lesson.slug,
            minutes: lesson.duration_minutes ?? undefined,
            learningGoals: lesson.learning_goals_json ?? undefined,
          }))}
        />
      </div>
    </div>
  );
}
