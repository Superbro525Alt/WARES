import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import type { Guide } from "@/lib/db/types";

export async function listGuides(params?: {
  search?: string;
  publishedOnly?: boolean;
}): Promise<Guide[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("guides").select("*");
  if (params?.publishedOnly) {
    query = query.eq("published", true);
  }
  if (params?.search) {
    query = query.textSearch("search", params.search, { type: "websearch" });
  }
  const { data, error } = await query.order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as Guide;
}

export async function getGuideById(id: string): Promise<Guide | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Guide;
}

export async function upsertGuide(input: Partial<Guide> & { id?: string }) {
  const supabase = createSupabaseAdminClient();
  const payload = {
    ...input,
    updated_at: new Date().toISOString(),
  };
  if (input.id) {
    const { data, error } = await supabase
      .from("guides")
      .update({
        slug: payload.slug,
        title: payload.title,
        summary: payload.summary,
        difficulty: payload.difficulty,
        est_minutes: payload.est_minutes,
        content_md: payload.content_md,
        published: payload.published,
        updated_at: payload.updated_at,
      })
      .eq("id", input.id)
      .select("*")
      .single();
    if (error) throw error;
    return data as Guide;
  }

  const { data, error } = await supabase
    .from("guides")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as Guide;
}

export async function setGuideProducts(guideId: string, productIds: string[]) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("guide_links").delete().eq("guide_id", guideId);
  if (productIds.length) {
    const { error } = await supabase
      .from("guide_links")
      .insert(productIds.map((productId) => ({ guide_id: guideId, product_id: productId })));
    if (error) throw error;
  }
}

export async function getLinkedProductIds(guideId: string): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("guide_links")
    .select("product_id")
    .eq("guide_id", guideId);
  if (error) throw error;
  return data?.map((row) => row.product_id).filter(Boolean) ?? [];
}

export async function deleteGuide(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("guides").delete().eq("id", id);
  if (error) throw error;
}
