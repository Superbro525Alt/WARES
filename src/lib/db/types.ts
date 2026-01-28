export type Role = "admin" | "user";

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  created_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  long_description_md: string | null;
  category_id: string | null;
  difficulty: string | null;
  teacher_friendly: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductSection {
  product_id: string;
  overview_md: string | null;
  quickstart_md: string | null;
  intended_use_md: string | null;
  good_practice_md: string | null;
  bad_practice_md: string | null;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  difficulty: string | null;
  est_minutes: number | null;
  content_md: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  learning_goals_json: string[] | null;
  prerequisites_json: string[] | null;
  duration_minutes: number | null;
  content_md: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductTag {
  product_id: string;
  tag_id: string;
}

export interface GuideLink {
  guide_id: string;
  product_id: string | null;
}

export interface LessonLink {
  lesson_id: string;
  product_id: string | null;
}

export interface Faq {
  id: string;
  product_id: string;
  question: string;
  answer_md: string | null;
  order_index: number;
}

export interface MediaYoutube {
  id: string;
  product_id: string;
  title: string;
  youtube_url: string;
  order_index: number;
}

export interface MediaImage {
  id: string;
  product_id: string;
  title: string | null;
  alt_text: string | null;
  caption: string | null;
  storage_path: string;
  width: number | null;
  height: number | null;
  order_index: number;
}

export type PdfKind = "datasheet" | "manual" | "diagram" | "other";

export interface DownloadPdf {
  id: string;
  product_id: string;
  title: string;
  description: string | null;
  kind: PdfKind;
  version: string | null;
  storage_path: string;
  order_index: number;
}

export interface CadEmbed {
  id: string;
  product_id: string;
  title: string;
  embed_url: string;
  notes_md: string | null;
  order_index: number;
}

export type ModelFormat = "glb" | "gltf" | "obj" | "stl" | "other";

export interface Model3d {
  id: string;
  product_id: string;
  title: string;
  storage_path: string;
  format: ModelFormat;
  notes_md: string | null;
  order_index: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface ProductWithRelations {
  product: Product;
  section: ProductSection | null;
  category: Category | null;
  tags: Tag[];
  guides: Guide[];
  lessons: Lesson[];
  faqs: Faq[];
  youtube: MediaYoutube[];
  images: MediaImage[];
  pdfs: DownloadPdf[];
  cad: CadEmbed[];
  models: Model3d[];
}
