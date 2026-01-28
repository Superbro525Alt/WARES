"use server";

import { productSchema } from "@/lib/db/schema.zod";
import { productRepository } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const data = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid product data.");
  }
  const product = await productRepository.upsert({
    ...parsed.data,
    long_description_md: parsed.data.long_description_md ?? null,
  });
  await productRepository.upsertSection(product.id, {
    product_id: product.id,
    overview_md: null,
    quickstart_md: null,
    intended_use_md: null,
    good_practice_md: null,
    bad_practice_md: null,
  });
  revalidatePath("/admin/products");
}

export async function deleteProductAction(id: string): Promise<void> {
  await requireAdmin();
  await productRepository.delete(id);
  revalidatePath("/admin/products");
}
