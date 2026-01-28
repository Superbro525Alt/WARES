"use server";

import { lessonSchema } from "@/lib/db/schema.zod";
import { lessonRepository } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createLesson(formData: FormData): Promise<void> {
  await requireAdmin();
  const data = Object.fromEntries(formData.entries());
  const parsed = lessonSchema.safeParse({
    ...data,
    learning_goals: [],
    prerequisites: [],
    product_ids: [],
  });
  if (!parsed.success) {
    throw new Error("Invalid lesson.");
  }
  const lesson = await lessonRepository.upsert({
    ...parsed.data,
    content_md: parsed.data.content_md ?? null,
    learning_goals_json: parsed.data.learning_goals,
    prerequisites_json: parsed.data.prerequisites,
  });
  revalidatePath("/admin/lessons");
}

export async function deleteLessonAction(id: string): Promise<void> {
  await requireAdmin();
  await lessonRepository.delete(id);
  revalidatePath("/admin/lessons");
}

export async function saveLesson(payload: string) {
  try {
    await requireAdmin();
    const data = JSON.parse(payload);
    const parsed = lessonSchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false, error: "Invalid lesson." };
    }
    const lesson = await lessonRepository.upsert({
      id: data.id,
      ...parsed.data,
      content_md: parsed.data.content_md ?? null,
      learning_goals_json: parsed.data.learning_goals,
      prerequisites_json: parsed.data.prerequisites,
    });
    await lessonRepository.setProducts(lesson.id, data.product_ids ?? []);
    revalidatePath("/admin/lessons");
    revalidatePath(`/admin/lessons/${lesson.id}`);
    revalidatePath(`/lessons/${lesson.slug}`);
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? "Save failed." };
  }
}
