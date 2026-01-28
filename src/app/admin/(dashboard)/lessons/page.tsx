import Link from "next/link";
import { lessonRepository } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLesson, deleteLessonAction } from "@/app/admin/(dashboard)/lessons/actions";

export default async function AdminLessonsPage() {
  const lessons = await lessonRepository.list();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Lessons</h1>
        <Button asChild variant="outline">
          <Link href="/lessons">Public lessons</Link>
        </Button>
      </div>

      <form action={createLesson} className="grid gap-3 rounded-2xl border border-border/60 bg-background p-4 md:grid-cols-4">
        <Input name="title" placeholder="Lesson title" required />
        <Input name="slug" placeholder="Slug" required />
        <Input name="summary" placeholder="Summary" required />
        <Button type="submit">Create lesson</Button>
        <input type="hidden" name="content_md" value="" />
        <input type="hidden" name="published" value="false" />
      </form>

      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="flex flex-col justify-between gap-3 rounded-2xl border border-border/60 bg-background p-4 md:flex-row md:items-center"
          >
            <div>
              <p className="text-sm font-semibold">{lesson.title}</p>
              <p className="text-xs text-muted-foreground">/{lesson.slug}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/lessons/${lesson.id}`}>Edit</Link>
              </Button>
              <form action={deleteLessonAction.bind(null, lesson.id)}>
                <Button size="sm" variant="destructive" type="submit">
                  Delete
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
