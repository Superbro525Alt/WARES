import type { ProductRepository, GuideRepository, LessonRepository } from "@/lib/db/repositories/interfaces";
import * as products from "@/lib/db/supabase/products";
import * as guides from "@/lib/db/supabase/guides";
import * as lessons from "@/lib/db/supabase/lessons";

export const productRepository: ProductRepository = {
  list: products.listProducts,
  getBySlug: products.getProductBySlug,
  getById: products.getProductById,
  upsert: products.upsertProduct,
  upsertSection: products.upsertProductSection,
  setTags: products.setProductTags,
  setGuides: products.setProductGuides,
  setLessons: products.setProductLessons,
  delete: products.deleteProduct,
  listCategories: products.listCategories,
  listTags: products.listTags,
  upsertCategory: products.upsertCategory,
  upsertTag: products.upsertTag,
  deleteCategory: products.deleteCategory,
  deleteTag: products.deleteTag,
  upsertFaq: products.upsertFaq,
  deleteFaq: products.deleteFaq,
  upsertYoutube: products.upsertYoutube,
  deleteYoutube: products.deleteYoutube,
  upsertImage: products.upsertImage,
  deleteImage: products.deleteImage,
  upsertPdf: products.upsertPdf,
  deletePdf: products.deletePdf,
  upsertCad: products.upsertCad,
  deleteCad: products.deleteCad,
  upsertModel: products.upsertModel,
  deleteModel: products.deleteModel,
};

export const guideRepository: GuideRepository = {
  list: guides.listGuides,
  getBySlug: guides.getGuideBySlug,
  getById: guides.getGuideById,
  upsert: guides.upsertGuide,
  setProducts: guides.setGuideProducts,
  getLinkedProductIds: guides.getLinkedProductIds,
  delete: guides.deleteGuide,
};

export const lessonRepository: LessonRepository = {
  list: lessons.listLessons,
  getBySlug: lessons.getLessonBySlug,
  getById: lessons.getLessonById,
  upsert: lessons.upsertLesson,
  setProducts: lessons.setLessonProducts,
  getLinkedProductIds: lessons.getLinkedProductIds,
  delete: lessons.deleteLesson,
};
