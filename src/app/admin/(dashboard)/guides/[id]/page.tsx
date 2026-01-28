import { notFound } from "next/navigation";
import { guideRepository, productRepository } from "@/lib/db";
import { GuideEditor } from "@/components/admin/guide-editor";

export default async function AdminGuideEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guide = await guideRepository.getById(id);
  if (!guide) return notFound();

  const [products, linked] = await Promise.all([
    productRepository.list(),
    guideRepository.getLinkedProductIds(guide.id),
  ]);

  return (
    <GuideEditor guide={guide} products={products} linkedProductIds={linked} />
  );
}
