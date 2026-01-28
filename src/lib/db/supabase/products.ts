import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Product,
  ProductSection,
  ProductWithRelations,
  Category,
  Tag,
  Guide,
  Lesson,
  Faq,
  MediaYoutube,
  MediaImage,
  DownloadPdf,
  CadEmbed,
  Model3d,
} from "@/lib/db/types";

function withPublished(query: any, publishedOnly?: boolean) {
  if (publishedOnly) {
    return query.eq("published", true);
  }
  return query;
}

export async function listProducts(params?: {
  search?: string;
  category?: string;
  difficulty?: string;
  tag?: string;
  teacherFriendly?: boolean;
  publishedOnly?: boolean;
}): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("products").select("*");
  query = withPublished(query, params?.publishedOnly);

  if (params?.teacherFriendly) {
    query = query.eq("teacher_friendly", true);
  }
  if (params?.category) {
    query = query.eq("category_id", params.category);
  }
  if (params?.difficulty) {
    query = query.eq("difficulty", params.difficulty);
  }
  if (params?.tag) {
    const { data: tagLinks } = await supabase
      .from("product_tags")
      .select("product_id")
      .eq("tag_id", params.tag);
    const productIds = tagLinks?.map((row) => row.product_id) ?? [];
    query = query.in("id", productIds.length ? productIds : ["00000000-0000-0000-0000-000000000000"]);
  }
  if (params?.search) {
    query = query.textSearch("search", params.search, { type: "websearch" });
  }
  const { data, error } = await query.order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = await createSupabaseServerClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !product) return null;
  return getProductWithRelations(product.id);
}

export async function getProductById(id: string): Promise<ProductWithRelations | null> {
  return getProductWithRelations(id);
}

async function getProductWithRelations(id: string): Promise<ProductWithRelations | null> {
  const supabase = await createSupabaseServerClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !product) return null;

  const [tagLinks, guideLinks, lessonLinks] = await Promise.all([
    supabase.from("product_tags").select("tag_id").eq("product_id", id),
    supabase.from("guide_links").select("guide_id").eq("product_id", id),
    supabase.from("lesson_links").select("lesson_id").eq("product_id", id),
  ]);

  const tagIds = tagLinks.data?.map((row) => row.tag_id) ?? [];
  const guideIds = guideLinks.data?.map((row) => row.guide_id) ?? [];
  const lessonIds = lessonLinks.data?.map((row) => row.lesson_id) ?? [];

  const [
    section,
    category,
    tags,
    guides,
    lessons,
    faqs,
    youtube,
    images,
    pdfs,
    cad,
    models,
  ] = await Promise.all([
    supabase
      .from("product_sections")
      .select("*")
      .eq("product_id", id)
      .maybeSingle(),
    product.category_id
      ? supabase
          .from("categories")
          .select("*")
          .eq("id", product.category_id)
          .single()
      : Promise.resolve({ data: null, error: null }),
    tagIds.length
      ? supabase.from("tags").select("*").in("id", tagIds)
      : Promise.resolve({ data: [], error: null }),
    guideIds.length
      ? supabase.from("guides").select("*").in("id", guideIds)
      : Promise.resolve({ data: [], error: null }),
    lessonIds.length
      ? supabase.from("lessons").select("*").in("id", lessonIds)
      : Promise.resolve({ data: [], error: null }),
    supabase.from("faqs").select("*").eq("product_id", id).order("order_index"),
    supabase
      .from("media_youtube")
      .select("*")
      .eq("product_id", id)
      .order("order_index"),
    supabase
      .from("media_images")
      .select("*")
      .eq("product_id", id)
      .order("order_index"),
    supabase
      .from("downloads_pdfs")
      .select("*")
      .eq("product_id", id)
      .order("order_index"),
    supabase
      .from("cad_embeds")
      .select("*")
      .eq("product_id", id)
      .order("order_index"),
    supabase
      .from("models_3d")
      .select("*")
      .eq("product_id", id)
      .order("order_index"),
  ]);

  const categoryData = (category as { data?: Category | null }).data ?? null;
  const guidesData = (guides.data as Guide[]) ?? [];
  const lessonsData = (lessons.data as Lesson[]) ?? [];

  return {
    product,
    section: (section.data as ProductSection | null) ?? null,
    category: categoryData,
    tags: (tags.data as Tag[]) ?? [],
    guides: guidesData,
    lessons: lessonsData,
    faqs: (faqs.data as Faq[]) ?? [],
    youtube: (youtube.data as MediaYoutube[]) ?? [],
    images: (images.data as MediaImage[]) ?? [],
    pdfs: (pdfs.data as DownloadPdf[]) ?? [],
    cad: (cad.data as CadEmbed[]) ?? [],
    models: (models.data as Model3d[]) ?? [],
  };
}

export async function upsertProduct(
  input: Partial<Product> & { id?: string }
): Promise<Product> {
  const supabase = createSupabaseAdminClient();
  const payload = {
    ...input,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("products")
    .upsert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as Product;
}

export async function upsertProductSection(
  productId: string,
  section: ProductSection
) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("product_sections").upsert(section);
  if (error) throw error;
}

export async function setProductTags(productId: string, tagIds: string[]) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("product_tags").delete().eq("product_id", productId);
  if (tagIds.length) {
    const { error } = await supabase
      .from("product_tags")
      .insert(tagIds.map((tagId) => ({ product_id: productId, tag_id: tagId })));
    if (error) throw error;
  }
}

export async function setProductGuides(productId: string, guideIds: string[]) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("guide_links").delete().eq("product_id", productId);
  if (guideIds.length) {
    const { error } = await supabase
      .from("guide_links")
      .insert(guideIds.map((guideId) => ({ product_id: productId, guide_id: guideId })));
    if (error) throw error;
  }
}

export async function setProductLessons(productId: string, lessonIds: string[]) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("lesson_links").delete().eq("product_id", productId);
  if (lessonIds.length) {
    const { error } = await supabase
      .from("lesson_links")
      .insert(
        lessonIds.map((lessonId) => ({ product_id: productId, lesson_id: lessonId }))
      );
    if (error) throw error;
  }
}

export async function deleteProduct(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function listCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function listTags(): Promise<Tag[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("tags").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function upsertCategory(input: Category): Promise<Category> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .upsert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as Category;
}

export async function upsertTag(input: Tag): Promise<Tag> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("tags")
    .upsert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as Tag;
}

export async function deleteCategory(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteTag(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertFaq(productId: string, faq: Partial<Faq>) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("faqs").upsert({
    product_id: productId,
    ...faq,
  });
  if (error) throw error;
}

export async function deleteFaq(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertYoutube(productId: string, media: Partial<MediaYoutube>) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("media_youtube").upsert({
    product_id: productId,
    ...media,
  });
  if (error) throw error;
}

export async function deleteYoutube(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("media_youtube").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertImage(productId: string, media: Partial<MediaImage>) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("media_images").upsert({
    product_id: productId,
    ...media,
  });
  if (error) throw error;
}

export async function deleteImage(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("media_images").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertPdf(productId: string, media: Partial<DownloadPdf>) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("downloads_pdfs").upsert({
    product_id: productId,
    ...media,
  });
  if (error) throw error;
}

export async function deletePdf(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("downloads_pdfs").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertCad(productId: string, media: Partial<CadEmbed>) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("cad_embeds").upsert({
    product_id: productId,
    ...media,
  });
  if (error) throw error;
}

export async function deleteCad(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("cad_embeds").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertModel(productId: string, media: Partial<Model3d>) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("models_3d").upsert({
    product_id: productId,
    ...media,
  });
  if (error) throw error;
}

export async function deleteModel(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("models_3d").delete().eq("id", id);
  if (error) throw error;
}
