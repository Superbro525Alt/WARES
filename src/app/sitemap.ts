import type { MetadataRoute } from "next";
import { productRepository, guideRepository, lessonRepository } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [products, guides, lessons] = await Promise.all([
    productRepository.list({ publishedOnly: true }),
    guideRepository.list({ publishedOnly: true }),
    lessonRepository.list({ publishedOnly: true }),
  ]);

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/products`, lastModified: new Date() },
    { url: `${baseUrl}/guides`, lastModified: new Date() },
    { url: `${baseUrl}/lessons`, lastModified: new Date() },
    { url: `${baseUrl}/teacher-start-here`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    })),
    ...guides.map((guide) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      lastModified: guide.updated_at ? new Date(guide.updated_at) : new Date(),
    })),
    ...lessons.map((lesson) => ({
      url: `${baseUrl}/lessons/${lesson.slug}`,
      lastModified: lesson.updated_at ? new Date(lesson.updated_at) : new Date(),
    })),
  ];
}
