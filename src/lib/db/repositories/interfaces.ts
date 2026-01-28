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

export interface ProductRepository {
  list(params?: {
    search?: string;
    category?: string;
    difficulty?: string;
    tag?: string;
    teacherFriendly?: boolean;
    publishedOnly?: boolean;
  }): Promise<Product[]>;
  getBySlug(slug: string): Promise<ProductWithRelations | null>;
  getById(id: string): Promise<ProductWithRelations | null>;
  upsert(product: Partial<Product> & { id?: string }): Promise<Product>;
  upsertSection(productId: string, section: ProductSection): Promise<void>;
  setTags(productId: string, tagIds: string[]): Promise<void>;
  setGuides(productId: string, guideIds: string[]): Promise<void>;
  setLessons(productId: string, lessonIds: string[]): Promise<void>;
  delete(productId: string): Promise<void>;
  listCategories(): Promise<Category[]>;
  listTags(): Promise<Tag[]>;
  upsertCategory(input: Category): Promise<Category>;
  upsertTag(input: Tag): Promise<Tag>;
  deleteCategory(id: string): Promise<void>;
  deleteTag(id: string): Promise<void>;
  upsertFaq(productId: string, faq: Partial<Faq>): Promise<void>;
  deleteFaq(id: string): Promise<void>;
  upsertYoutube(productId: string, media: Partial<MediaYoutube>): Promise<void>;
  deleteYoutube(id: string): Promise<void>;
  upsertImage(productId: string, media: Partial<MediaImage>): Promise<void>;
  deleteImage(id: string): Promise<void>;
  upsertPdf(productId: string, media: Partial<DownloadPdf>): Promise<void>;
  deletePdf(id: string): Promise<void>;
  upsertCad(productId: string, media: Partial<CadEmbed>): Promise<void>;
  deleteCad(id: string): Promise<void>;
  upsertModel(productId: string, media: Partial<Model3d>): Promise<void>;
  deleteModel(id: string): Promise<void>;
}

export interface GuideRepository {
  list(params?: { search?: string; publishedOnly?: boolean }): Promise<Guide[]>;
  getBySlug(slug: string): Promise<Guide | null>;
  getById(id: string): Promise<Guide | null>;
  upsert(guide: Partial<Guide> & { id?: string }): Promise<Guide>;
  setProducts(guideId: string, productIds: string[]): Promise<void>;
  getLinkedProductIds(guideId: string): Promise<string[]>;
  delete(id: string): Promise<void>;
}

export interface LessonRepository {
  list(params?: { search?: string; publishedOnly?: boolean }): Promise<Lesson[]>;
  getBySlug(slug: string): Promise<Lesson | null>;
  getById(id: string): Promise<Lesson | null>;
  upsert(lesson: Partial<Lesson> & { id?: string }): Promise<Lesson>;
  setProducts(lessonId: string, productIds: string[]): Promise<void>;
  getLinkedProductIds(lessonId: string): Promise<string[]>;
  delete(id: string): Promise<void>;
}
