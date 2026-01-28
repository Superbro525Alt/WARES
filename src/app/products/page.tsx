import { productRepository } from "@/lib/db";
import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { SearchFilterBar } from "@/components/products/search-filter-bar";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const category = typeof params.category === "string" ? params.category : "";
  const difficulty = typeof params.difficulty === "string" ? params.difficulty : "";
  const tag = typeof params.tag === "string" ? params.tag : "";
  const teacherFriendly = params.teacher === "true";

  const [products, categories, tags] = await Promise.all([
    productRepository.list({
      search: search || undefined,
      category: category || undefined,
      difficulty: difficulty || undefined,
      tag: tag || undefined,
      teacherFriendly,
      publishedOnly: true,
    }),
    productRepository.listCategories(),
    productRepository.listTags(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14">
      <SectionHeading
        eyebrow="Products"
        title="Browse WARES components"
        description="Search for product documentation, specs, quickstarts, and teaching resources."
      />
      <div className="mt-8 max-w-5xl">
        <SearchFilterBar
          search={search}
          categories={categories}
          tags={tags}
          selectedCategory={category}
          selectedDifficulty={difficulty}
          selectedTag={tag}
          teacherFriendly={teacherFriendly}
        />
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            category={categories.find((cat) => cat.id === product.category_id) ?? null}
          />
        ))}
      </div>
    </div>
  );
}
