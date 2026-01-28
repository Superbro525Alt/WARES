import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import type { Lesson } from "@/lib/db/types";

export async function listLessons(params?: {
  search?: string;
  publishedOnly?: boolean;
}): Promise<Lesson[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("lessons").select("*");
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

export async function getLessonBySlug(slug: string): Promise<Lesson | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as Lesson;
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Lesson;
}

export async function upsertLesson(input: Partial<Lesson> & { id?: string }) {
  const supabase = createSupabaseAdminClient();
  const payload = {
    ...input,
    updated_at: new Date().toISOString(),
  };
  if (input.id) {
    const { data, error } = await supabase
      .from("lessons")
      .update({
        slug: payload.slug,
        title: payload.title,
        summary: payload.summary,
        learning_goals_json: payload.learning_goals_json,
        prerequisites_json: payload.prerequisites_json,
        duration_minutes: payload.duration_minutes,
        content_md: payload.content_md,
        published: payload.published,
        updated_at: payload.updated_at,
      })
      .eq("id", input.id)
      .select("*")
      .single();
    if (error) throw error;
    return data as Lesson;
  }

  const { data, error } = await supabase
    .from("lessons")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as Lesson;
}

export async function setLessonProducts(lessonId: string, productIds: string[]) {
  const supabase = createSupabaseAdminClient();
  await supabase.from("lesson_links").delete().eq("lesson_id", lessonId);
  if (productIds.length) {
    const { error } = await supabase
      .from("lesson_links")
      .insert(productIds.map((productId) => ({ lesson_id: lessonId, product_id: productId })));
    if (error) throw error;
  }
}

export async function getLinkedProductIds(lessonId: string): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("lesson_links")
    .select("product_id")
    .eq("lesson_id", lessonId);
  if (error) throw error;
  return data?.map((row) => row.product_id).filter(Boolean) ?? [];
}

export async function deleteLesson(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) throw error;
}
