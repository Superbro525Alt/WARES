"use server";

import { guideSchema } from "@/lib/db/schema.zod";
import { guideRepository } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createGuide(formData: FormData) {
  await requireAdmin();
  const data = Object.fromEntries(formData.entries());
  const parsed = guideSchema.safeParse({
    ...data,
    product_ids: [],
  });
  if (!parsed.success) {
    return { ok: false, error: "Invalid guide." };
  }
  const guide = await guideRepository.upsert({
    ...parsed.data,
    content_md: parsed.data.content_md ?? null,
  });
  revalidatePath("/admin/guides");
  return { ok: true, id: guide.id };
}

export async function deleteGuideAction(id: string) {
  await requireAdmin();
  await guideRepository.delete(id);
  revalidatePath("/admin/guides");
  return { ok: true };
}

export async function saveGuide(payload: string) {
  try {
    await requireAdmin();
    const data = JSON.parse(payload);
    const parsed = guideSchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false, error: "Invalid guide." };
    }
    const guide = await guideRepository.upsert({
      id: data.id,
      ...parsed.data,
      content_md: parsed.data.content_md ?? null,
    });
    await guideRepository.setProducts(guide.id, data.product_ids ?? []);
    revalidatePath("/admin/guides");
    revalidatePath(`/admin/guides/${guide.id}`);
    revalidatePath(`/guides/${guide.slug}`);
    return { ok: true, updated_at: guide.updated_at, content_length: guide.content_md?.length ?? 0 };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? "Save failed." };
  }
}
