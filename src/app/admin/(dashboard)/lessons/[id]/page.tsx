import { notFound } from "next/navigation";
import { lessonRepository, productRepository } from "@/lib/db";
import { LessonEditor } from "@/components/admin/lesson-editor";

export default async function AdminLessonEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = await lessonRepository.getById(id);
  if (!lesson) return notFound();

  const [products, linked] = await Promise.all([
    productRepository.list(),
    lessonRepository.getLinkedProductIds(lesson.id),
  ]);

  return (
    <LessonEditor lesson={lesson} products={products} linkedProductIds={linked} />
  );
}
