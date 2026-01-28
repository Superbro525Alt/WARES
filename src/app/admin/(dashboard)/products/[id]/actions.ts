"use server";

import { requireAdmin } from "@/lib/auth";
import { productRepository, guideRepository, lessonRepository } from "@/lib/db";
import { productSchema, productSectionSchema } from "@/lib/db/schema.zod";
import { revalidatePath } from "next/cache";

export async function saveProduct(payload: string) {
  try {
    await requireAdmin();
    const data = JSON.parse(payload);

    const productParsed = productSchema.safeParse(data.product);
    if (!productParsed.success) {
      return { ok: false, error: "Invalid product data." };
    }
    const product = await productRepository.upsert({
      id: data.product.id,
      ...productParsed.data,
    });

    const sectionParsed = productSectionSchema.safeParse(data.section ?? {});
    if (sectionParsed.success) {
      await productRepository.upsertSection(product.id, {
        product_id: product.id,
        overview_md: sectionParsed.data.overview_md ?? null,
        quickstart_md: sectionParsed.data.quickstart_md ?? null,
        intended_use_md: sectionParsed.data.intended_use_md ?? null,
        good_practice_md: sectionParsed.data.good_practice_md ?? null,
        bad_practice_md: sectionParsed.data.bad_practice_md ?? null,
      });
    }

    await productRepository.setTags(product.id, data.tagIds ?? []);
    await productRepository.setGuides(product.id, data.guideIds ?? []);
    await productRepository.setLessons(product.id, data.lessonIds ?? []);

    for (const id of data.removed?.faqs ?? []) {
      await productRepository.deleteFaq(id);
    }
    for (const id of data.removed?.youtube ?? []) {
      await productRepository.deleteYoutube(id);
    }
    for (const id of data.removed?.images ?? []) {
      await productRepository.deleteImage(id);
    }
    for (const id of data.removed?.pdfs ?? []) {
      await productRepository.deletePdf(id);
    }
    for (const id of data.removed?.cad ?? []) {
      await productRepository.deleteCad(id);
    }
    for (const id of data.removed?.models ?? []) {
      await productRepository.deleteModel(id);
    }

  const clean = <T extends { id?: string }>(item: T) => {
    if (!item?.id) {
      const { id: _id, ...rest } = item;
      void _id;
      return rest;
    }
    return item;
  };

  for (const [index, faq] of (data.faqs ?? []).entries()) {
    await productRepository.upsertFaq(product.id, {
      ...clean(faq),
      order_index: index,
    });
  }
  for (const [index, item] of (data.youtube ?? []).entries()) {
    await productRepository.upsertYoutube(product.id, {
      ...clean(item),
      order_index: index,
    });
  }
  for (const [index, item] of (data.images ?? []).entries()) {
    await productRepository.upsertImage(product.id, {
      ...clean(item),
      order_index: index,
    });
  }
  for (const [index, item] of (data.pdfs ?? []).entries()) {
    await productRepository.upsertPdf(product.id, {
      ...clean(item),
      order_index: index,
    });
  }
  for (const [index, item] of (data.cad ?? []).entries()) {
    await productRepository.upsertCad(product.id, {
      ...clean(item),
      order_index: index,
    });
  }
  for (const [index, item] of (data.models ?? []).entries()) {
    await productRepository.upsertModel(product.id, {
      ...clean(item),
      order_index: index,
    });
  }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${product.id}`);
    revalidatePath(`/products/${product.slug}`);
    return { ok: true, id: product.id };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? "Save failed." };
  }
}

export async function listGuideOptions() {
  return await guideRepository.list();
}

export async function listLessonOptions() {
  return await lessonRepository.list();
}
