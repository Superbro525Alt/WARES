import { productRepository } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upsertCategoryAction, deleteCategoryAction } from "@/app/admin/(dashboard)/categories/actions";

export default async function AdminCategoriesPage() {
  const categories = await productRepository.listCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Categories</h1>
      <form action={upsertCategoryAction} className="grid gap-3 rounded-2xl border border-border/60 bg-background p-4 md:grid-cols-3">
        <Input name="name" placeholder="Category name" required />
        <Input name="slug" placeholder="Slug" required />
        <Button type="submit">Add category</Button>
      </form>
      <div className="grid gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="grid gap-3 rounded-2xl border border-border/60 bg-background p-4 md:grid-cols-4"
          >
            <form action={upsertCategoryAction} className="grid gap-3 md:col-span-3 md:grid-cols-3">
              <input type="hidden" name="id" value={category.id} />
              <Input name="name" defaultValue={category.name} />
              <Input name="slug" defaultValue={category.slug} />
              <Button type="submit" variant="outline">
                Save
              </Button>
            </form>
            <form action={deleteCategoryAction.bind(null, category.id)}>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
