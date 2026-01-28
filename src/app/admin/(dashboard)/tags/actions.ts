"use server";

import { tagSchema } from "@/lib/db/schema.zod";
import { productRepository } from "@/lib/db";
import type { Tag } from "@/lib/db/types";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function upsertTagAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const data = Object.fromEntries(formData.entries());
  const parsed = tagSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid tag.");
  }
  const tag: Tag = {
    id: data.id?.toString() ?? crypto.randomUUID(),
    name: parsed.data.name,
    slug: parsed.data.slug,
  };
  await productRepository.upsertTag(tag);
  revalidatePath("/admin/tags");
}

export async function deleteTagAction(id: string): Promise<void> {
  await requireAdmin();
  await productRepository.deleteTag(id);
  revalidatePath("/admin/tags");
}
