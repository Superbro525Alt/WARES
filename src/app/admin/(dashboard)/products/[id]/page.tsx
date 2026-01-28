import { notFound } from "next/navigation";
import { productRepository, guideRepository, lessonRepository } from "@/lib/db";
import { ProductEditor } from "@/components/admin/product-editor";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productData = await productRepository.getById(id);
  if (!productData) return notFound();

  const [categories, tags, guides, lessons] = await Promise.all([
    productRepository.listCategories(),
    productRepository.listTags(),
    guideRepository.list(),
    lessonRepository.list(),
  ]);

  return (
    <ProductEditor
      productData={productData}
      categories={categories}
      tags={tags}
      guides={guides}
      lessons={lessons}
    />
  );
}
