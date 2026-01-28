"use server";

import { categorySchema } from "@/lib/db/schema.zod";
import { productRepository } from "@/lib/db";
import type { Category } from "@/lib/db/types";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function upsertCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const data = Object.fromEntries(formData.entries());
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid category.");
  }
  const category: Category = {
    id: data.id?.toString() ?? crypto.randomUUID(),
    name: parsed.data.name,
    slug: parsed.data.slug,
  };
  await productRepository.upsertCategory(category);
  revalidatePath("/admin/categories");
}

export async function deleteCategoryAction(id: string): Promise<void> {
  await requireAdmin();
  await productRepository.deleteCategory(id);
  revalidatePath("/admin/categories");
}
