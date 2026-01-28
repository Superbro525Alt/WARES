import { z } from "zod";

const booleanFromString = z.preprocess((value) => {
  if (typeof value === "string") {
    return value === "true";
  }
  return value;
}, z.boolean());

export const slugSchema = z
  .string()
  .min(2)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only.");

export const productSchema = z.object({
  slug: slugSchema,
  name: z.string().min(2),
  short_description: z.string().min(10),
  long_description_md: z.string().optional().nullable(),
  category_id: z.string().uuid().nullable().optional(),
  difficulty: z.string().optional().nullable(),
  teacher_friendly: booleanFromString.default(false),
  published: booleanFromString.default(false),
});

export const productSectionSchema = z.object({
  overview_md: z.string().optional().nullable(),
  quickstart_md: z.string().optional().nullable(),
  intended_use_md: z.string().optional().nullable(),
  good_practice_md: z.string().optional().nullable(),
  bad_practice_md: z.string().optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: slugSchema,
});

export const tagSchema = z.object({
  name: z.string().min(2),
  slug: slugSchema,
});

export const guideSchema = z.object({
  slug: slugSchema,
  title: z.string().min(2),
  summary: z.string().optional().nullable(),
  difficulty: z.string().optional().nullable(),
  est_minutes: z.coerce.number().int().positive().optional().nullable(),
  content_md: z.string().optional().nullable(),
  published: booleanFromString.default(false),
  product_ids: z.array(z.string().uuid()).optional().default([]),
});

export const lessonSchema = z.object({
  slug: slugSchema,
  title: z.string().min(2),
  summary: z.string().optional().nullable(),
  learning_goals: z.array(z.string()).optional().default([]),
  prerequisites: z.array(z.string()).optional().default([]),
  duration_minutes: z.coerce.number().int().positive().optional().nullable(),
  content_md: z.string().optional().nullable(),
  published: booleanFromString.default(false),
  product_ids: z.array(z.string().uuid()).optional().default([]),
});

export const faqSchema = z.object({
  question: z.string().min(2),
  answer_md: z.string().optional().nullable(),
  order_index: z.coerce.number().int().default(0),
});

export const youtubeSchema = z.object({
  title: z.string().min(2),
  youtube_url: z.string().url(),
  order_index: z.coerce.number().int().default(0),
});

export const imageSchema = z.object({
  title: z.string().optional().nullable(),
  alt_text: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
  storage_path: z.string().min(2),
  width: z.coerce.number().int().nullable().optional(),
  height: z.coerce.number().int().nullable().optional(),
  order_index: z.coerce.number().int().default(0),
});

export const pdfSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  kind: z.enum(["datasheet", "manual", "diagram", "other"]).default("other"),
  version: z.string().optional().nullable(),
  storage_path: z.string().min(2),
  order_index: z.coerce.number().int().default(0),
});

export const cadSchema = z.object({
  title: z.string().min(2),
  embed_url: z.string().url(),
  notes_md: z.string().optional().nullable(),
  order_index: z.coerce.number().int().default(0),
});

export const modelSchema = z.object({
  title: z.string().min(2),
  storage_path: z.string().min(2),
  format: z.enum(["glb", "gltf", "obj", "stl", "other"]).default("glb"),
  notes_md: z.string().optional().nullable(),
  order_index: z.coerce.number().int().default(0),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});
